#!/usr/bin/env python3
import json, os, re, urllib.parse, urllib.request, webbrowser, threading, time, html
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

ROOT=Path(__file__).resolve().parent
CONFIG_PATH=ROOT/"config.json"
BIBLE_BASE="https://thedouayrheims.com"

BOOKS=["genesis","exodus","leviticus","numbers","deuteronomy","josue","judges","ruth","1-kings","2-kings","3-kings","4-kings","1-paralipomenon","2-paralipomenon","1-esdras","2-esdras","tobias","judith","esther","1-machabees","2-machabees","job","psalms","proverbs","ecclesiastes","canticle-of-canticles","wisdom","ecclesiasticus","isaie","jeremie","lamentations","baruch","ezechiel","daniel","osee","joel","amos","abdias","jonas","micheas","nahum","habacuc","sophonias","aggeus","zacharias","malachie","prayer-of-manasses","3-esdras","4-esdras","matthew","mark","luke","john","acts","romans","1-corinthians","2-corinthians","galatians","ephesians","philippians","colossians","1-thessalonians","2-thessalonians","1-timothy","2-timothy","titus","philemon","hebrews","james","1-peter","2-peter","1-john","2-john","3-john","jude","apocalypse"]

VATICAN_BASE="https://www.vatican.va/content/catechism/en.html"

def load_config():
    try:return json.loads(CONFIG_PATH.read_text())
    except:return {}

def save_config(d):
    current=load_config()
    for k,v in d.items():
        if v not in ("",None):current[k]=v
    CONFIG_PATH.write_text(json.dumps(current,indent=2))
    try:os.chmod(CONFIG_PATH,0o600)
    except:pass

def url_json(url,method="GET",payload=None,headers=None,timeout=45):
    data=None if payload is None else json.dumps(payload).encode()
    h={"User-Agent":"CatholicCompassAI/0.6","Content-Type":"application/json"}
    if headers:h.update(headers)
    req=urllib.request.Request(url,data=data,method=method,headers=h)
    with urllib.request.urlopen(req,timeout=timeout) as r:
        return json.loads(r.read().decode())

def extract_output_text(resp):
    out=[]
    for item in resp.get("output",[]):
        if item.get("type")=="message":
            for c in item.get("content",[]):
                if c.get("type")=="output_text":out.append(c.get("text",""))
    return "\n".join(out).strip()

def openai_call(prompt,model=None):
    cfg=load_config(); key=cfg.get("openai_api_key") or os.getenv("OPENAI_API_KEY")
    if not key:raise RuntimeError("AI is not configured yet. Open AI & Voice Setup and add your OpenAI API key.")
    model=model or cfg.get("model","gpt-5.6-terra")
    resp=url_json("https://api.openai.com/v1/responses","POST",
        {"model":model,"input":prompt},
        {"Authorization":f"Bearer {key}"},timeout=90)
    text=extract_output_text(resp)
    if not text:raise RuntimeError("The AI returned an empty response.")
    return text

def clean_json(text):
    text=text.strip()
    text=re.sub(r"^```(?:json)?\s*","",text); text=re.sub(r"\s*```$","",text)
    a=text.find("{"); b=text.rfind("}")
    if a>=0 and b>a:text=text[a:b+1]
    return json.loads(text)

def bible_search(q,limit=15):
    return url_json(BIBLE_BASE+"/api/search?"+urllib.parse.urlencode({"q":q,"scope":"verses","limit":limit}))

def flatten_hits(data):
    rows=[]
    for h in data.get("results",[]):
        for v in h.get("verses",[]):
            rows.append({"reference":f"{h.get('bookName',h.get('heading',''))} {h.get('chapter')}:{v.get('verse')}",
                         "text":v.get("text",""),"slug":h.get("slug"),"chapter":h.get("chapter"),"verse":v.get("verse")})
    return rows

def retrieve_scripture(situation,lang):
    # AI produces 3-5 simple English search concepts; Bible is English DR corpus.
    p=f"""You are preparing retrieval queries for a Catholic Bible search engine.
User situation: {situation}
Return ONLY JSON: {{"queries":["single word or short phrase", "..."]}}
Use 3 to 5 morally relevant English concepts likely to appear in the Douay-Rheims Bible. Include concepts for recognizing the wrong, repentance/mercy, and conversion/change."""
    try:
        q=clean_json(openai_call(p)).get("queries",[])
    except:
        low=situation.lower()
        q=["mercy","repent","charity"]
        if any(x in low for x in ["lie","lied","deceiv"]):q=["truth","lying","mercy","repent"]
        if any(x in low for x in ["drink","drunk","alcohol","driv"]):q=["drunkenness","charity","mercy","renewed"]
    rows=[]
    seen=set()
    for term in q[:5]:
        try:
            for r in flatten_hits(bible_search(term,10)):
                if r["reference"] not in seen:
                    rows.append(r);seen.add(r["reference"])
        except:pass
    return rows[:30],q

SYSTEM_RULES="""You are Catholic Compass AI, a Catholic moral-guidance companion.
You are NOT a priest and NEVER grant absolution, assign sacramental penance, guarantee forgiveness, or declare with certainty that a person is in mortal sin.
Use Catholic categories carefully: mortal sin requires grave matter, full knowledge, and deliberate consent.
Distinguish:
1. what the Catholic Church teaches,
2. possible application to the user's situation,
3. what only a priest can do.
If grave matter may be involved, recommend sacramental Confession and Catholic Communion discipline carefully.
Use compassionate, adult, plain language, not condemnation.
Practical repair/restitution and prevention should be specific.
Catechism paragraph numbers must be used only when reasonably confident. If unsure, omit them rather than inventing.
Scripture selections MUST come only from the retrieved Douay-Rheims passages supplied below. Do not fabricate verses or wording.
The action list is a progress plan, not a mechanism by which the app forgives sins.
Return valid JSON only."""

def analyze(situation,lang):
    rows,queries=retrieve_scripture(situation,lang)
    evidence="\n".join(f"- {r['reference']}: {r['text']}" for r in rows)
    langname={"en":"English","es":"Spanish","pt":"Portuguese","fr":"French"}.get(lang,"English")
    prompt=SYSTEM_RULES+f"""

Respond in {langname}.
User situation:
{situation}

Retrieved public-domain Original Douay-Rheims Scripture:
{evidence}

Return EXACTLY this JSON shape:
{{
 "title":"short situation title",
 "severity":"grave|uncertain|venial",
 "severity_label":"human-friendly label",
 "catholic_teaching":"what the Catholic Church teaches, clearly named as Catholic Church",
 "catechism_refs":["2290"],
 "assessment":"careful application; distinguish grave matter from personal mortal sin",
 "actions":["specific visible completion step", "..."],
 "scripture":[
   {{"purpose":"Recognize","reference":"reference exactly from evidence","text":"exact verse text from evidence","why":"why it applies"}},
   {{"purpose":"Repent","reference":"...","text":"...","why":"..."}},
   {{"purpose":"Change","reference":"...","text":"...","why":"..."}}
 ],
 "next_step_summary":"concise next step",
 "prevention":{{"avoid":"what not to do","do_instead":"what to do instead","spiritual_practice":"habit / Bible practice"}},
 "prayer":{{"title":"appropriate prayer name","text":"full prayer text, either a traditional short Catholic prayer or an original prayer clearly not presented as liturgical text"}},
 "confession_words":"plain-language sentence(s) the user could use to begin confession",
 "priest_only":"what requires a priest/sacrament"
}}
Make actions concrete and include reading the recommended Scripture as separate Scripture completion cards, so do not duplicate all Scripture readings in actions."""
    raw=openai_call(prompt)
    data=clean_json(raw)
    return data,queries

def strip_html(raw):
    raw=re.sub(r"<script.*?</script>"," ",raw,flags=re.S|re.I)
    raw=re.sub(r"<style.*?</style>"," ",raw,flags=re.S|re.I)
    raw=re.sub(r"<[^>]+>"," ",raw);return re.sub(r"\s+"," ",html.unescape(raw)).strip()

def catechism_lookup(ref):
    # v0.6 links authoritatively to Vatican; extracts paragraph from English master page/searchable content when possible.
    # Use Vatican search URL for exact paragraph if extraction fails.
    url=f"https://www.vatican.va/archive/ENG0015/_INDEX.HTM"
    try:
        req=urllib.request.Request(url,headers={"User-Agent":"CatholicCompassAI/0.6"})
        with urllib.request.urlopen(req,timeout=25) as r: plain=strip_html(r.read().decode("utf-8","ignore"))
        n=int(re.sub(r"\D","",ref) or 0)
        if n:
            m=re.search(rf"\b{n}\b(.*?)(?=\b{n+1}\b)",plain,re.S)
            if m:return m.group(1).strip(),url
    except:pass
    return f"Open the official Vatican Catechism and search for paragraph {ref}.",VATICAN_BASE

class H(SimpleHTTPRequestHandler):
    def translate_path(self,path):
        p=urllib.parse.urlparse(path).path
        if p=="/setup":rel="setup.html"
        else:rel=p.lstrip("/") or "index.html"
        return str(ROOT/rel)
    def json(self,obj,status=200):
        b=json.dumps(obj,ensure_ascii=False).encode();self.send_response(status);self.send_header("Content-Type","application/json; charset=utf-8");self.send_header("Content-Length",str(len(b)));self.end_headers();self.wfile.write(b)
    def body(self):
        n=int(self.headers.get("Content-Length","0") or 0)
        return json.loads(self.rfile.read(n).decode() or "{}") if n else {}
    def do_GET(self):
        u=urllib.parse.urlparse(self.path);q=urllib.parse.parse_qs(u.query);cfg=load_config()
        if u.path=="/api/status":return self.json({"openai_configured":bool(cfg.get("openai_api_key") or os.getenv("OPENAI_API_KEY")),"tts_configured":bool((cfg.get("elevenlabs_api_key") or os.getenv("ELEVENLABS_API_KEY")) and (cfg.get("elevenlabs_voice_id") or os.getenv("ELEVENLABS_VOICE_ID"))),"bible_books":len(BOOKS)})
        if u.path=="/api/config":return self.json({"openai_configured":bool(cfg.get("openai_api_key")),"tts_configured":bool(cfg.get("elevenlabs_api_key") and cfg.get("elevenlabs_voice_id")),"model":cfg.get("model","gpt-5.6-terra")})
        if u.path=="/api/catechism":
            ref=q.get("ref",[""])[0]
            text,url=catechism_lookup(ref);return self.json({"ref":ref,"text":text,"official_url":url})
        if u.path=="/api/bible/book":
            slug=q.get("slug",[""])[0]
            if slug not in BOOKS:return self.json({"error":"Unknown Catholic Bible book"},404)
            try:return self.json(url_json(f"{BIBLE_BASE}/data/odr/{slug}.json"))
            except Exception as e:return self.json({"error":str(e)},502)
        return super().do_GET()
    def do_POST(self):
        try:p=self.body()
        except:return self.json({"error":"Invalid JSON"},400)
        if self.path=="/api/config":
            try:save_config({"openai_api_key":p.get("openai_api_key"),"model":p.get("model"),"elevenlabs_api_key":p.get("elevenlabs_api_key"),"elevenlabs_voice_id":p.get("elevenlabs_voice_id")});return self.json({"ok":True})
            except Exception as e:return self.json({"error":str(e)},500)
        if self.path=="/api/analyze":
            text=(p.get("text") or "").strip();lang=p.get("lang","en")
            if not text:return self.json({"error":"Tell Compass what happened first."},400)
            try:
                a,q=analyze(text,lang);return self.json({"analysis":a,"retrieval_queries":q})
            except Exception as e:return self.json({"error":str(e)},502)
        if self.path=="/api/tts":
            cfg=load_config();key=cfg.get("elevenlabs_api_key") or os.getenv("ELEVENLABS_API_KEY");voice=cfg.get("elevenlabs_voice_id") or os.getenv("ELEVENLABS_VOICE_ID")
            if not key or not voice:return self.json({"error":"Natural voice is not configured. Open AI & Voice Setup."},503)
            text=(p.get("text") or "").strip()
            try:
                url=f"https://api.elevenlabs.io/v1/text-to-speech/{urllib.parse.quote(voice)}?output_format=mp3_44100_128"
                body=json.dumps({"text":text,"model_id":"eleven_multilingual_v2","voice_settings":{"stability":0.76,"similarity_boost":0.68,"style":0.05,"use_speaker_boost":True,"speed":0.82}}).encode()
                req=urllib.request.Request(url,data=body,method="POST",headers={"xi-api-key":key,"Content-Type":"application/json"})
                with urllib.request.urlopen(req,timeout=90) as r:b=r.read()
                self.send_response(200);self.send_header("Content-Type","audio/mpeg");self.send_header("Content-Length",str(len(b)));self.end_headers();self.wfile.write(b);return
            except Exception as e:return self.json({"error":str(e)},502)
        return self.json({"error":"Not found"},404)

if __name__=="__main__":
    os.chdir(ROOT);port=8765
    print(f"Catholic Compass AI v0.6 is running at http://localhost:{port}")
    ThreadingHTTPServer(("127.0.0.1",port),H).serve_forever()
