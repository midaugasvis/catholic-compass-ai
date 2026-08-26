import json, os, re, urllib.parse, urllib.request
from http.server import BaseHTTPRequestHandler

BIBLE_BASE = "https://thedouayrheims.com"
VATICAN_BASE = "https://www.vatican.va/content/catechism/en.html"

def url_json(url, method='GET', payload=None, headers=None, timeout=45):
    data = None if payload is None else json.dumps(payload).encode()
    h = {'User-Agent':'CatholicCompassAI/0.6','Content-Type':'application/json'}
    if headers: h.update(headers)
    req = urllib.request.Request(url, data=data, method=method, headers=h)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())

def extract_output_text(resp):
    out = []
    for item in resp.get('output', []):
        if item.get('type') == 'message':
            for c in item.get('content', []):
                if c.get('type') == 'output_text': out.append(c.get('text',''))
    return '\n'.join(out).strip()

def clean_json(text):
    text = text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    a, b = text.find('{'), text.rfind('}')
    if a >= 0 and b > a: text = text[a:b+1]
    return json.loads(text)

def openai_call(prompt):
    key = os.getenv('OPENAI_API_KEY')
    model = os.getenv('OPENAI_MODEL','gpt-5.6-terra')
    if not key: raise RuntimeError('OPENAI_API_KEY is not configured on the server.')
    resp = url_json('https://api.openai.com/v1/responses','POST',{'model':model,'input':prompt},{'Authorization':'Bearer '+key},90)
    text = extract_output_text(resp)
    if not text: raise RuntimeError('The AI returned an empty response.')
    return text

def bible_search(q, limit=15):
    url = BIBLE_BASE + '/api/search?' + urllib.parse.urlencode({'q':q,'scope':'verses','limit':limit})
    return url_json(url)

def flatten_hits(data):
    rows=[]
    for h in data.get('results',[]):
        for v in h.get('verses',[]):
            rows.append({'reference':f"{h.get('bookName',h.get('heading',''))} {h.get('chapter')}:{v.get('verse')}",'text':v.get('text','')})
    return rows

def retrieve_scripture(situation):
    query_prompt = 'Return ONLY JSON with a queries array of 3 to 5 short English Catholic moral or Bible search concepts relevant to this situation:\n' + situation
    try: queries = clean_json(openai_call(query_prompt)).get('queries',[])
    except Exception: queries = ['mercy','repent','charity']
    rows=[]; seen=set()
    for term in queries[:5]:
        try:
            for r in flatten_hits(bible_search(term,10)):
                if r['reference'] not in seen:
                    rows.append(r); seen.add(r['reference'])
        except Exception: pass
    return rows[:30]

RULES = ('You are Catholic Compass AI, a Catholic moral-guidance companion. '
         'You are not a priest. Never grant absolution, assign sacramental penance, guarantee forgiveness, '
         'or declare mortal sin with certainty. Mortal sin requires grave matter, full knowledge, and deliberate consent. '
         'Separate Catholic Church teaching, tentative application, and what only a priest can do. '
         'Use compassionate adult language. Use only the retrieved Scripture quoted below. '
         'Do not invent Catechism paragraph numbers; omit them when unsure. Return valid JSON only.')

def analyze(situation, lang):
    rows = retrieve_scripture(situation)
    evidence = '\n'.join('- '+r['reference']+': '+r['text'] for r in rows)
    langname = {'en':'English','es':'Spanish','pt':'Portuguese','fr':'French'}.get(lang,'English')
    shape = {
      'title':'...', 'severity':'grave|uncertain|venial', 'severity_label':'...',
      'catholic_teaching':'...', 'catechism_refs':[], 'assessment':'...', 'actions':['...'],
      'scripture':[
        {'purpose':'Recognize','reference':'...','text':'...','why':'...'},
        {'purpose':'Repent','reference':'...','text':'...','why':'...'},
        {'purpose':'Change','reference':'...','text':'...','why':'...'}],
      'next_step_summary':'...',
      'prevention':{'avoid':'...','do_instead':'...','spiritual_practice':'...'},
      'prayer':{'title':'...','text':'...'},
      'confession_words':'...', 'priest_only':'...'}
    prompt = RULES + '\nRespond in '+langname+'.\nSituation:\n'+situation+'\nRetrieved Scripture:\n'+evidence+'\nReturn exactly this JSON shape:\n'+json.dumps(shape)
    return clean_json(openai_call(prompt))

class handler(BaseHTTPRequestHandler):
    def _json(self,obj,status=200):
        body=json.dumps(obj,ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Content-Length',str(len(body)))
        self.end_headers(); self.wfile.write(body)

    def _body(self):
        n=int(self.headers.get('Content-Length','0') or 0)
        return json.loads(self.rfile.read(n).decode() or '{}') if n else {}

    def do_GET(self):
        p=urllib.parse.urlparse(self.path)
        q=urllib.parse.parse_qs(p.query)
        if p.path == '/api/status':
            return self._json({'openai_configured':bool(os.getenv('OPENAI_API_KEY')),'tts_configured':bool(os.getenv('ELEVENLABS_API_KEY') and os.getenv('ELEVENLABS_VOICE_ID'))})
        if p.path == '/api/catechism':
            ref=q.get('ref',[''])[0]
            return self._json({'ref':ref,'text':'Open the official Vatican Catechism and search for paragraph '+ref+'.','official_url':VATICAN_BASE})
        return self._json({'error':'Not found'},404)

    def do_POST(self):
        try: p=self._body()
        except Exception: return self._json({'error':'Invalid JSON'},400)
        if self.path == '/api/analyze':
            text=(p.get('text') or '').strip()
            if not text: return self._json({'error':'Tell Compass what happened first.'},400)
            try: return self._json({'analysis':analyze(text,p.get('lang','en'))})
            except Exception as e: return self._json({'error':str(e)},502)
        if self.path == '/api/tts':
            key=os.getenv('ELEVENLABS_API_KEY'); voice=os.getenv('ELEVENLABS_VOICE_ID')
            if not key or not voice: return self._json({'error':'Natural voice is not configured on the server.'},503)
            text=(p.get('text') or '').strip()
            try:
                url=f'https://api.elevenlabs.io/v1/text-to-speech/{urllib.parse.quote(voice)}?output_format=mp3_44100_128'
                payload={'text':text,'model_id':'eleven_multilingual_v2','voice_settings':{'stability':0.76,'similarity_boost':0.68,'style':0.05,'use_speaker_boost':True,'speed':0.82}}
                req=urllib.request.Request(url,data=json.dumps(payload).encode(),method='POST',headers={'xi-api-key':key,'Content-Type':'application/json'})
                with urllib.request.urlopen(req,timeout=90) as r: audio=r.read()
                self.send_response(200); self.send_header('Content-Type','audio/mpeg'); self.send_header('Content-Length',str(len(audio))); self.end_headers(); self.wfile.write(audio); return
            except Exception as e: return self._json({'error':str(e)},502)
        return self._json({'error':'Not found'},404)
