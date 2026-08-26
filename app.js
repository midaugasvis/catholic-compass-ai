const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const speechSupported='speechSynthesis' in window;
let currentLang='en';
let activePrayerId=null;

const T={
en:{
language:"Language",nav_talk:"Talk to Compass",nav_journey:"My Journey",nav_insights:"Monthly Progress",nav_examine:"Examination",nav_prayers:"Prayers",nav_privacy:"Privacy",
audio_access:"Audio accessibility",audio_access_desc:"Every generated outcome can be read aloud in the selected language.",trust_title:"Guidance, not absolution",trust_desc:"This tool does not replace a priest or the Sacrament of Reconciliation.",
guide_kicker:"Catholic guidance in plain language",guide_title:"Tell me what happened.",guide_desc:"You don’t need to know the name of the sin. Explain the situation in your own words.",
welcome_title:"I’m here to help you understand the next step.",welcome_desc:"I’ll separate Church teaching from a possible assessment, then suggest practical and spiritual next steps.",
situation_ph:"Example: I drove after drinking and had passengers in the car.",ex_drunk:"Drunk driving",ex_lie:"Lying",ex_mass:"Missed Mass",ex_cruel:"Cruel words",ask_btn:"Help me understand what to do",
response_model:"How Compass responds",step1:"Church teaching",step1s:"Relevant Catechism / Scripture",step2:"Possible assessment",step2s:"Grave matter, venial, or uncertain",step3:"Reconciliation journey",step3s:"Track each practical and spiritual step",step4:"Prevention guidance",step4s:"Avoid / Do instead / Scripture",
trust_principles:"Trust principles",tp1:"Never invents a fixed “price” for forgiveness.",tp2:"Never claims to absolve sins.",tp3:"Keeps progress separate from sacramental forgiveness.",tp4:"Encourages Confession when appropriate.",
journey_kicker:"Reconciliation journey",journey_title:"Complete the next good step.",journey_desc:"Each case stays open until you complete the practical and spiritual actions attached to it.",
insights_kicker:"Personal progress",insights_title:"Your monthly reconciliation curve.",insights_desc:"Track opened and completed journeys without pretending the app itself grants forgiveness.",open_cases:"Open journeys",closed_cases:"Completed journeys",completion_rate:"Completion rate",monthly_curve:"Monthly curve",chart_note:"Demo data + your current activity",
examine_kicker:"Examination of conscience",examine_title:"Reflect without a checklist feeling.",theme1:"God & worship",theme1d:"Prayer, Mass, reverence, trust in God.",theme2:"Truth & honesty",theme2d:"Lying, deception, broken promises, gossip.",theme3:"Life & safety",theme3d:"Anger, violence, reckless behaviour, care for others.",theme4:"Relationships",theme4d:"Marriage, family, forgiveness, cruelty, neglect.",
prayers_kicker:"Prayer library",prayers_title:"Open, read, and listen.",prayers_desc:"Suggested prayers are clickable so nobody needs to know them by heart.",privacy_kicker:"Privacy center",privacy_title:"Sensitive by design.",privacy_desc:"The production app should make its privacy model explicit, understandable, and technically true.",
priv1:"Encrypted storage",priv1d:"Production target: encrypt sensitive records at rest and in transit.",priv2:"No advertising profile",priv2d:"Do not monetize or sell spiritual-history data.",priv3:"User-controlled deletion",priv3d:"Delete one case, all history, or the entire account.",priv4:"Transparent AI processing",priv4d:"Clearly disclose whenever text must be processed by an AI provider. Never promise “never leaves your device” unless that is technically true.",
prototype_note:"Alpha privacy note",prototype_note_desc:"This prototype runs locally in your browser and stores demo journey state only in local browser storage. It does not send your entries to a server.",
full_prayer:"Full prayer",listen:"▶ Listen",mark_complete:"Mark completed",
church_teaching:"What the Catholic Church teaches",possible_assessment:"Possible assessment",what_now:"What to do now",prayer_now:"Suggested prayer",priest_only:"What only a priest can do",listen_outcome:"▶ Listen to full guidance",save_journey:"Save to my journey",action_plan:"Your complete action plan",bible_reading:"Bible readings for this situation",recognize:"Recognize",repent:"Repent",change:"Change",why_this:"Why this helps",voice_note:"Slow, calm male voice selected when available.",complete_step:"Complete",completed_step:"Completed",voice_quality_title:"Voice quality in this Alpha",voice_quality_desc:"This prototype uses your device’s built-in voice. It may still sound synthetic. Production will use a dedicated neural male narrator for natural, consistent speech.",
avoid:"Avoid",do_instead:"Do instead",scripture:"Scripture",progress:"completed",closed:"Journey completed",opened:"Open journey"
},
es:{
language:"Idioma",nav_talk:"Hablar con Compass",nav_journey:"Mi camino",nav_insights:"Progreso mensual",nav_examine:"Examen",nav_prayers:"Oraciones",nav_privacy:"Privacidad",
audio_access:"Accesibilidad por audio",audio_access_desc:"Cada resultado puede escucharse en el idioma seleccionado.",trust_title:"Orientación, no absolución",trust_desc:"Esta herramienta no sustituye al sacerdote ni al Sacramento de la Reconciliación.",
guide_kicker:"Orientación católica en lenguaje sencillo",guide_title:"Cuéntame qué pasó.",guide_desc:"No necesitas saber el nombre del pecado. Explica la situación con tus propias palabras.",
welcome_title:"Estoy aquí para ayudarte a entender el siguiente paso.",welcome_desc:"Separaré la enseñanza de la Iglesia de una posible valoración y sugeriré próximos pasos prácticos y espirituales.",
situation_ph:"Ejemplo: conduje después de beber y llevaba pasajeros.",ex_drunk:"Conducir ebrio",ex_lie:"Mentir",ex_mass:"Faltar a misa",ex_cruel:"Palabras crueles",ask_btn:"Ayúdame a entender qué hacer",
response_model:"Cómo responde Compass",step1:"Enseñanza de la Iglesia",step1s:"Catecismo / Escritura relevantes",step2:"Posible valoración",step2s:"Materia grave, venial o incierta",step3:"Camino de reconciliación",step3s:"Sigue cada paso práctico y espiritual",step4:"Orientación preventiva",step4s:"Evitar / Hacer en su lugar / Escritura",
trust_principles:"Principios de confianza",tp1:"Nunca inventa un “precio” fijo para el perdón.",tp2:"Nunca afirma absolver pecados.",tp3:"Separa el progreso de la absolución sacramental.",tp4:"Anima a confesarse cuando corresponde.",
journey_kicker:"Camino de reconciliación",journey_title:"Completa el siguiente buen paso.",journey_desc:"Cada caso permanece abierto hasta completar sus acciones prácticas y espirituales.",
insights_kicker:"Progreso personal",insights_title:"Tu curva mensual de reconciliación.",insights_desc:"Sigue los caminos abiertos y completados sin fingir que la app concede el perdón.",open_cases:"Caminos abiertos",closed_cases:"Caminos completados",completion_rate:"Tasa de finalización",monthly_curve:"Curva mensual",chart_note:"Datos demo + actividad actual",
examine_kicker:"Examen de conciencia",examine_title:"Reflexiona sin sentir que es una lista.",theme1:"Dios y culto",theme1d:"Oración, misa, reverencia, confianza en Dios.",theme2:"Verdad y honestidad",theme2d:"Mentiras, engaño, promesas rotas, chismes.",theme3:"Vida y seguridad",theme3d:"Ira, violencia, conducta temeraria, cuidado de otros.",theme4:"Relaciones",theme4d:"Matrimonio, familia, perdón, crueldad, negligencia.",
prayers_kicker:"Biblioteca de oraciones",prayers_title:"Abrir, leer y escuchar.",prayers_desc:"Las oraciones sugeridas se pueden abrir para que nadie tenga que saberlas de memoria.",privacy_kicker:"Centro de privacidad",privacy_title:"Sensible por diseño.",privacy_desc:"La app final debe explicar su modelo de privacidad de forma clara y técnicamente verdadera.",
priv1:"Almacenamiento cifrado",priv1d:"Objetivo de producción: cifrar registros sensibles en reposo y en tránsito.",priv2:"Sin perfil publicitario",priv2d:"No monetizar ni vender datos del historial espiritual.",priv3:"Eliminación controlada por el usuario",priv3d:"Borrar un caso, todo el historial o la cuenta completa.",priv4:"Procesamiento de IA transparente",priv4d:"Informar claramente cuando el texto deba ser procesado por un proveedor de IA.",
prototype_note:"Nota de privacidad del Alpha",prototype_note_desc:"Este prototipo funciona localmente en tu navegador y guarda el estado demo sólo en el almacenamiento local. No envía tus entradas a un servidor.",
full_prayer:"Oración completa",listen:"▶ Escuchar",mark_complete:"Marcar como completada",
church_teaching:"Lo que enseña la Iglesia Católica",possible_assessment:"Posible valoración",what_now:"Qué hacer ahora",prayer_now:"Oración sugerida",priest_only:"Lo que sólo puede hacer un sacerdote",listen_outcome:"▶ Escuchar toda la orientación",save_journey:"Guardar en mi camino",action_plan:"Tu plan de acción completo",bible_reading:"Lecturas bíblicas para esta situación",recognize:"Reconocer",repent:"Arrepentirse",change:"Cambiar",why_this:"Por qué ayuda",voice_note:"Se selecciona una voz masculina lenta y serena cuando está disponible.",complete_step:"Completar",completed_step:"Completado",voice_quality_title:"Calidad de voz en este Alpha",voice_quality_desc:"Este prototipo usa la voz integrada del dispositivo. Puede seguir sonando sintética. La versión final usará un narrador masculino neuronal dedicado.",
avoid:"Evitar",do_instead:"Hacer en su lugar",scripture:"Escritura",progress:"completado",closed:"Camino completado",opened:"Camino abierto"
},
pt:{
language:"Idioma",nav_talk:"Falar com Compass",nav_journey:"Minha jornada",nav_insights:"Progresso mensal",nav_examine:"Exame",nav_prayers:"Orações",nav_privacy:"Privacidade",
audio_access:"Acessibilidade por áudio",audio_access_desc:"Cada resultado pode ser ouvido no idioma selecionado.",trust_title:"Orientação, não absolvição",trust_desc:"Esta ferramenta não substitui um sacerdote nem o Sacramento da Reconciliação.",
guide_kicker:"Orientação católica em linguagem simples",guide_title:"Conte-me o que aconteceu.",guide_desc:"Você não precisa saber o nome do pecado. Explique a situação com suas próprias palavras.",
welcome_title:"Estou aqui para ajudar você a entender o próximo passo.",welcome_desc:"Vou separar o ensinamento da Igreja de uma possível avaliação e sugerir próximos passos práticos e espirituais.",
situation_ph:"Exemplo: dirigi depois de beber e havia passageiros no carro.",ex_drunk:"Dirigir embriagado",ex_lie:"Mentir",ex_mass:"Faltar à missa",ex_cruel:"Palavras cruéis",ask_btn:"Ajude-me a entender o que fazer",
response_model:"Como o Compass responde",step1:"Ensinamento da Igreja",step1s:"Catecismo / Escritura relevantes",step2:"Possível avaliação",step2s:"Matéria grave, venial ou incerta",step3:"Jornada de reconciliação",step3s:"Acompanhe cada passo prático e espiritual",step4:"Orientação preventiva",step4s:"Evitar / Fazer em vez disso / Escritura",
trust_principles:"Princípios de confiança",tp1:"Nunca inventa um “preço” fixo para o perdão.",tp2:"Nunca afirma absolver pecados.",tp3:"Separa progresso de absolvição sacramental.",tp4:"Incentiva a Confissão quando apropriado.",
journey_kicker:"Jornada de reconciliação",journey_title:"Complete o próximo bom passo.",journey_desc:"Cada caso permanece aberto até que as ações práticas e espirituais sejam concluídas.",
insights_kicker:"Progresso pessoal",insights_title:"Sua curva mensal de reconciliação.",insights_desc:"Acompanhe jornadas abertas e concluídas sem fingir que o app concede perdão.",open_cases:"Jornadas abertas",closed_cases:"Jornadas concluídas",completion_rate:"Taxa de conclusão",monthly_curve:"Curva mensal",chart_note:"Dados demo + atividade atual",
examine_kicker:"Exame de consciência",examine_title:"Reflita sem parecer uma lista.",theme1:"Deus e culto",theme1d:"Oração, missa, reverência, confiança em Deus.",theme2:"Verdade e honestidade",theme2d:"Mentiras, engano, promessas quebradas, fofoca.",theme3:"Vida e segurança",theme3d:"Raiva, violência, imprudência, cuidado com os outros.",theme4:"Relacionamentos",theme4d:"Casamento, família, perdão, crueldade, negligência.",
prayers_kicker:"Biblioteca de orações",prayers_title:"Abrir, ler e ouvir.",prayers_desc:"As orações sugeridas podem ser abertas para que ninguém precise decorá-las.",privacy_kicker:"Centro de privacidade",privacy_title:"Sensível por design.",privacy_desc:"O app final deve explicar seu modelo de privacidade de forma clara e tecnicamente verdadeira.",
priv1:"Armazenamento criptografado",priv1d:"Meta de produção: criptografar registros sensíveis em repouso e em trânsito.",priv2:"Sem perfil publicitário",priv2d:"Não monetizar nem vender dados do histórico espiritual.",priv3:"Exclusão controlada pelo usuário",priv3d:"Excluir um caso, todo o histórico ou a conta inteira.",priv4:"Processamento de IA transparente",priv4d:"Informar claramente quando o texto precisar ser processado por um provedor de IA.",
prototype_note:"Nota de privacidade do Alpha",prototype_note_desc:"Este protótipo roda localmente no navegador e salva apenas o estado demo no armazenamento local. Não envia suas entradas para um servidor.",
full_prayer:"Oração completa",listen:"▶ Ouvir",mark_complete:"Marcar como concluída",
church_teaching:"O que a Igreja Católica ensina",possible_assessment:"Possível avaliação",what_now:"O que fazer agora",prayer_now:"Oração sugerida",priest_only:"O que só um sacerdote pode fazer",listen_outcome:"▶ Ouvir toda a orientação",save_journey:"Salvar na minha jornada",action_plan:"Seu plano de ação completo",bible_reading:"Leituras bíblicas para esta situação",recognize:"Reconhecer",repent:"Arrepender-se",change:"Mudar",why_this:"Por que isso ajuda",voice_note:"Uma voz masculina lenta e serena é selecionada quando disponível.",complete_step:"Concluir",completed_step:"Concluído",voice_quality_title:"Qualidade da voz neste Alpha",voice_quality_desc:"Este protótipo usa a voz integrada do dispositivo. Ela ainda pode soar sintética. A versão final usará um narrador masculino neural dedicado.",
avoid:"Evitar",do_instead:"Fazer em vez disso",scripture:"Escritura",progress:"concluído",closed:"Jornada concluída",opened:"Jornada aberta"
},
fr:{
language:"Langue",nav_talk:"Parler à Compass",nav_journey:"Mon parcours",nav_insights:"Progrès mensuel",nav_examine:"Examen",nav_prayers:"Prières",nav_privacy:"Confidentialité",
audio_access:"Accessibilité audio",audio_access_desc:"Chaque résultat peut être lu à voix haute dans la langue sélectionnée.",trust_title:"Orientation, pas absolution",trust_desc:"Cet outil ne remplace ni un prêtre ni le sacrement de Réconciliation.",
guide_kicker:"Orientation catholique en langage simple",guide_title:"Dites-moi ce qui s’est passé.",guide_desc:"Vous n’avez pas besoin de connaître le nom du péché. Expliquez la situation avec vos propres mots.",
welcome_title:"Je suis là pour vous aider à comprendre la prochaine étape.",welcome_desc:"Je séparerai l’enseignement de l’Église d’une évaluation possible, puis proposerai des étapes pratiques et spirituelles.",
situation_ph:"Exemple : j’ai conduit après avoir bu avec des passagers dans la voiture.",ex_drunk:"Conduite en état d’ivresse",ex_lie:"Mensonge",ex_mass:"Messe manquée",ex_cruel:"Paroles cruelles",ask_btn:"Aidez-moi à comprendre quoi faire",
response_model:"Comment Compass répond",step1:"Enseignement de l’Église",step1s:"Catéchisme / Écriture pertinents",step2:"Évaluation possible",step2s:"Matière grave, vénielle ou incertaine",step3:"Parcours de réconciliation",step3s:"Suivez chaque étape pratique et spirituelle",step4:"Conseils de prévention",step4s:"Éviter / Faire à la place / Écriture",
trust_principles:"Principes de confiance",tp1:"N’invente jamais un « prix » fixe pour le pardon.",tp2:"Ne prétend jamais absoudre les péchés.",tp3:"Sépare le progrès de l’absolution sacramentelle.",tp4:"Encourage la Confession lorsque c’est approprié.",
journey_kicker:"Parcours de réconciliation",journey_title:"Accomplissez la prochaine bonne étape.",journey_desc:"Chaque cas reste ouvert jusqu’à l’accomplissement des actions pratiques et spirituelles.",
insights_kicker:"Progrès personnel",insights_title:"Votre courbe mensuelle de réconciliation.",insights_desc:"Suivez les parcours ouverts et terminés sans prétendre que l’application accorde le pardon.",open_cases:"Parcours ouverts",closed_cases:"Parcours terminés",completion_rate:"Taux d’achèvement",monthly_curve:"Courbe mensuelle",chart_note:"Données démo + activité actuelle",
examine_kicker:"Examen de conscience",examine_title:"Réfléchissez sans effet de liste.",theme1:"Dieu et culte",theme1d:"Prière, messe, révérence, confiance en Dieu.",theme2:"Vérité et honnêteté",theme2d:"Mensonge, tromperie, promesses rompues, commérages.",theme3:"Vie et sécurité",theme3d:"Colère, violence, imprudence, souci des autres.",theme4:"Relations",theme4d:"Mariage, famille, pardon, cruauté, négligence.",
prayers_kicker:"Bibliothèque de prières",prayers_title:"Ouvrir, lire et écouter.",prayers_desc:"Les prières suggérées sont ouvrables pour que personne n’ait besoin de les connaître par cœur.",privacy_kicker:"Centre de confidentialité",privacy_title:"Sensible par conception.",privacy_desc:"L’application finale doit expliquer son modèle de confidentialité clairement et honnêtement.",
priv1:"Stockage chiffré",priv1d:"Objectif production : chiffrer les données sensibles au repos et en transit.",priv2:"Aucun profil publicitaire",priv2d:"Ne pas monétiser ni vendre les données de l’historique spirituel.",priv3:"Suppression contrôlée par l’utilisateur",priv3d:"Supprimer un cas, tout l’historique ou le compte entier.",priv4:"Traitement IA transparent",priv4d:"Indiquer clairement quand le texte doit être traité par un fournisseur d’IA.",
prototype_note:"Note de confidentialité Alpha",prototype_note_desc:"Ce prototype fonctionne localement dans votre navigateur et ne conserve l’état démo que dans le stockage local. Il n’envoie pas vos entrées à un serveur.",
full_prayer:"Prière complète",listen:"▶ Écouter",mark_complete:"Marquer comme terminée",
church_teaching:"Ce que l’Église catholique enseigne",possible_assessment:"Évaluation possible",what_now:"Que faire maintenant",prayer_now:"Prière suggérée",priest_only:"Ce que seul un prêtre peut faire",listen_outcome:"▶ Écouter toute l’orientation",save_journey:"Enregistrer dans mon parcours",action_plan:"Votre plan d’action complet",bible_reading:"Lectures bibliques pour cette situation",recognize:"Reconnaître",repent:"Se repentir",change:"Changer",why_this:"Pourquoi cela aide",voice_note:"Une voix masculine lente et posée est sélectionnée lorsqu’elle est disponible.",complete_step:"Terminer",completed_step:"Terminé",voice_quality_title:"Qualité de la voix dans cet Alpha",voice_quality_desc:"Ce prototype utilise la voix intégrée de l’appareil. Elle peut encore sembler synthétique. La version finale utilisera un narrateur masculin neuronal dédié.",
avoid:"Éviter",do_instead:"Faire à la place",scripture:"Écriture",progress:"terminé",closed:"Parcours terminé",opened:"Parcours ouvert"
}
};

const EX={
en:{drunk:"I drove after drinking and had passengers in the car. I knew I should not have been driving.",lie:"I lied to someone close to me because I was afraid of the consequences.",mass:"I missed Sunday Mass because I simply chose not to go, even though I could have.",cruel:"I said very cruel things to my spouse during an argument and I regret it."},
es:{drunk:"Conduje después de beber y llevaba pasajeros. Sabía que no debía conducir.",lie:"Mentí a alguien cercano porque tenía miedo de las consecuencias.",mass:"Falté a misa dominical porque decidí no ir aunque podía hacerlo.",cruel:"Dije cosas muy crueles a mi cónyuge durante una discusión y me arrepiento."},
pt:{drunk:"Dirigi depois de beber e havia passageiros no carro. Eu sabia que não deveria dirigir.",lie:"Menti para alguém próximo porque tinha medo das consequências.",mass:"Falte à missa de domingo porque simplesmente escolhi não ir, embora pudesse.",cruel:"Disse coisas muito cruéis ao meu cônjuge durante uma discussão e me arrependo."},
fr:{drunk:"J’ai conduit après avoir bu avec des passagers dans la voiture. Je savais que je ne devais pas conduire.",lie:"J’ai menti à quelqu’un de proche parce que j’avais peur des conséquences.",mass:"J’ai manqué la messe du dimanche simplement parce que j’ai choisi de ne pas y aller alors que je le pouvais.",cruel:"J’ai dit des choses très cruelles à mon conjoint pendant une dispute et je le regrette."}
};

const PRAYERS={
contrition:{
title:{en:"Act of Contrition",es:"Acto de Contrición",pt:"Ato de Contrição",fr:"Acte de contrition"},
text:{
en:"O my God, I am heartily sorry for having offended You, and I detest all my sins because I dread the loss of Heaven and the pains of Hell, but most of all because they offend You, my God, who are all good and deserving of all my love.\n\nI firmly resolve, with the help of Your grace, to confess my sins, to do penance, and to amend my life. Amen.",
es:"Dios mío, me arrepiento de todo corazón de haberte ofendido y detesto todos mis pecados, porque temo la pérdida del Cielo y las penas del infierno, pero sobre todo porque te ofenden a Ti, Dios mío, que eres todo bondad y digno de todo mi amor.\n\nPropongo firmemente, con la ayuda de tu gracia, confesar mis pecados, hacer penitencia y enmendar mi vida. Amén.",
pt:"Meu Deus, arrependo-me de todo o coração de Vos ter ofendido e detesto todos os meus pecados, porque temo a perda do Céu e as penas do inferno, mas sobretudo porque Vos ofendem, meu Deus, que sois todo bom e digno de todo o meu amor.\n\nProponho firmemente, com a ajuda da Vossa graça, confessar os meus pecados, fazer penitência e emendar a minha vida. Amém.",
fr:"Mon Dieu, j’ai un très grand regret de Vous avoir offensé et je déteste tous mes péchés, parce que je crains la perte du Ciel et les peines de l’enfer, mais surtout parce qu’ils Vous offensent, Vous qui êtes infiniment bon et digne de tout mon amour.\n\nJe prends la ferme résolution, avec le secours de Votre grâce, de confesser mes péchés, de faire pénitence et de changer ma vie. Amen."
}},
harmed:{
title:{en:"Prayer for someone I harmed",es:"Oración por alguien a quien dañé",pt:"Oração por alguém que feri",fr:"Prière pour quelqu’un que j’ai blessé"},
text:{
en:"Lord Jesus, protect and bless the person I harmed. Give me wisdom to repair what I can, humility to accept responsibility, and strength not to repeat the same wrong. Lead me toward truth, charity, and peace. Amen.",
es:"Señor Jesús, protege y bendice a la persona a quien hice daño. Dame sabiduría para reparar lo que pueda, humildad para aceptar mi responsabilidad y fuerza para no repetir el mismo mal. Guíame hacia la verdad, la caridad y la paz. Amén.",
pt:"Senhor Jesus, protege e abençoa a pessoa que feri. Dá-me sabedoria para reparar o que puder, humildade para assumir a responsabilidade e força para não repetir o mesmo erro. Conduz-me à verdade, à caridade e à paz. Amém.",
fr:"Seigneur Jésus, protège et bénis la personne que j’ai blessée. Donne-moi la sagesse de réparer ce que je peux, l’humilité d’accepter ma responsabilité et la force de ne pas répéter la même faute. Conduis-moi vers la vérité, la charité et la paix. Amen."
}},
before_confession:{
title:{en:"Before Confession",es:"Antes de la Confesión",pt:"Antes da Confissão",fr:"Avant la Confession"},
text:{
en:"Lord, give me honesty, humility, and courage. Help me to confess clearly, without hiding what matters and without despairing of Your mercy. Amen.",
es:"Señor, dame honestidad, humildad y valor. Ayúdame a confesar con claridad, sin ocultar lo importante y sin desesperar de tu misericordia. Amén.",
pt:"Senhor, dá-me honestidade, humildade e coragem. Ajuda-me a confessar com clareza, sem esconder o que importa e sem desesperar da Tua misericórdia. Amém.",
fr:"Seigneur, donne-moi honnêteté, humilité et courage. Aide-moi à me confesser clairement, sans cacher l’essentiel et sans désespérer de Ta miséricorde. Amen."
}}
};

const R={
drunk:{
title:{en:"Driving while intoxicated and endangering others",es:"Conducir ebrio poniendo a otros en peligro",pt:"Dirigir embriagado colocando outros em perigo",fr:"Conduire en état d’ivresse en mettant autrui en danger"},
sev:"grave",
sevText:{en:"Potentially grave matter",es:"Posiblemente materia grave",pt:"Possivelmente matéria grave",fr:"Possiblement matière grave"},
teaching:{en:"The Catechism teaches that those who, through drunkenness, endanger their own and others’ safety on the road incur grave guilt.",es:"El Catecismo enseña que quienes, por embriaguez, ponen en peligro su seguridad y la de otros en la carretera incurren en culpa grave.",pt:"O Catecismo ensina que aqueles que, por embriaguez, colocam em perigo a própria segurança e a dos outros na estrada incorrem em culpa grave.",fr:"Le Catéchisme enseigne que ceux qui, par ivresse, mettent en danger leur sécurité et celle d’autrui sur la route se rendent gravement coupables."},
source:"Catechism §2290",
assessment:{en:"This clearly involves grave matter. Mortal sin personally also requires full knowledge and deliberate consent.",es:"Esto implica claramente materia grave. El pecado mortal personal también requiere pleno conocimiento y consentimiento deliberado.",pt:"Isto envolve claramente matéria grave. O pecado mortal pessoal também exige pleno conhecimento e consentimento deliberado.",fr:"Cela implique clairement une matière grave. Le péché mortel suppose aussi pleine connaissance et consentement délibéré."},
next:{en:"Make a sincere Act of Contrition, decide never to drive after drinking again, and go to Confession. If anyone was harmed, repair what you reasonably can.",es:"Haz un Acto de Contrición sincero, decide no volver a conducir después de beber y acude a la Confesión. Si alguien resultó perjudicado, repara razonablemente lo que puedas.",pt:"Faça um Ato de Contrição sincero, decida nunca mais dirigir depois de beber e procure a Confissão. Se alguém foi prejudicado, repare o que puder razoavelmente.",fr:"Faites un Acte de contrition sincère, décidez de ne plus conduire après avoir bu et allez vous confesser. Si quelqu’un a été lésé, réparez raisonnablement ce qui peut l’être."},
priest:{en:"A priest gives sacramental absolution and assigns your penance. The app must not invent a fixed number of prayers.",es:"Un sacerdote concede la absolución sacramental y asigna la penitencia. La app no debe inventar un número fijo de oraciones.",pt:"Um sacerdote concede a absolvição sacramental e determina a penitência. O app não deve inventar um número fixo de orações.",fr:"Un prêtre donne l’absolution sacramentelle et assigne la pénitence. L’application ne doit pas inventer un nombre fixe de prières."},
prayer:"contrition",
bible:{
 recognize:{
   ref:"Romans 13:10",
   text:{
    en:"The love of our neighbour worketh no evil. Love therefore is the fulfilling of the law.",
    es:"El amor no hace mal al prójimo; por eso, el amor es el cumplimiento de la ley.",
    pt:"O amor não faz mal ao próximo; por isso, o amor é o cumprimento da lei.",
    fr:"L’amour ne fait point de mal au prochain; l’amour est donc l’accomplissement de la loi."
   },
   why:{
    en:"It names the moral core clearly: love of another person is incompatible with knowingly exposing that person to avoidable danger.",
    es:"Expresa con claridad el núcleo moral: amar al prójimo es incompatible con exponerlo conscientemente a un peligro evitable.",
    pt:"Mostra claramente o núcleo moral: amar o próximo é incompatível com expô-lo conscientemente a um perigo evitável.",
    fr:"Il exprime clairement le cœur moral : aimer son prochain est incompatible avec l’exposer consciemment à un danger évitable."
   }
 },
 repent:{
   ref:"Psalm 50 (51):3–4",
   text:{
    en:"Have mercy on me, O God, according to thy great mercy. And according to the multitude of thy tender mercies blot out my iniquity. Wash me yet more from my iniquity, and cleanse me from my sin.",
    es:"Ten misericordia de mí, oh Dios, según tu gran misericordia. Borra mi iniquidad según la abundancia de tu compasión. Lávame más y más de mi culpa y límpiame de mi pecado.",
    pt:"Tem misericórdia de mim, ó Deus, segundo a tua grande misericórdia. Apaga a minha iniquidade segundo a abundância da tua compaixão. Lava-me cada vez mais da minha culpa e purifica-me do meu pecado.",
    fr:"Ayez pitié de moi, ô Dieu, selon votre grande miséricorde. Effacez mon iniquité selon la multitude de vos bontés. Lavez-moi davantage de mon iniquité et purifiez-moi de mon péché."
   },
   why:{
    en:"This is a direct prayer of repentance: admit the wrong, ask for mercy, and ask God to cleanse and change you.",
    es:"Es una oración directa de arrepentimiento: reconocer el mal, pedir misericordia y pedir a Dios que te purifique y cambie.",
    pt:"É uma oração direta de arrependimento: reconhecer o erro, pedir misericórdia e pedir a Deus que purifique e transforme você.",
    fr:"C’est une prière directe de repentir : reconnaître le mal, demander miséricorde et demander à Dieu de vous purifier et de vous changer."
   }
 },
 change:{
   ref:"Ephesians 4:22–24",
   text:{
    en:"Put off, according to former conversation, the old man, who is corrupted according to the desire of error. And be renewed in the spirit of your mind: And put on the new man, who according to God is created in justice and holiness of truth.",
    es:"Despojaos del hombre viejo, corrompido por los deseos engañosos; renovaos en el espíritu de vuestra mente y revestíos del hombre nuevo, creado según Dios en justicia y santidad de la verdad.",
    pt:"Despojai-vos do homem velho, corrompido pelos desejos enganosos; renovai-vos no espírito da vossa mente e revesti-vos do homem novo, criado segundo Deus na justiça e santidade da verdade.",
    fr:"Dépouillez-vous du vieil homme, corrompu par les convoitises trompeuses; renouvelez-vous dans l’esprit de votre intelligence et revêtez l’homme nouveau, créé selon Dieu dans la justice et la sainteté de la vérité."
   },
   why:{
    en:"Repentance is not only regret. It includes changing the pattern that produced the sin—in this case, making sure alcohol and driving never meet again.",
    es:"El arrepentimiento no es sólo pesar. Incluye cambiar el patrón que produjo el pecado; en este caso, impedir que el alcohol y la conducción vuelvan a coincidir.",
    pt:"O arrependimento não é apenas pesar. Inclui mudar o padrão que produziu o pecado — neste caso, garantir que álcool e direção nunca mais se encontrem.",
    fr:"Le repentir n’est pas seulement le regret. Il suppose de changer le comportement qui a conduit au péché — ici, faire en sorte que l’alcool et la conduite ne se rencontrent plus."
   }
 }
},
tasks:[
 {en:"Read and understand Catechism §2290",es:"Leer y comprender el Catecismo §2290",pt:"Ler e compreender o Catecismo §2290",fr:"Lire et comprendre le Catéchisme §2290"},
 {en:"Pray the Act of Contrition",es:"Rezar el Acto de Contrición",pt:"Rezar o Ato de Contrição",fr:"Prier l’Acte de contrition"},
 {en:"Create a zero-driving-after-alcohol rule",es:"Adoptar una regla de cero conducción tras beber",pt:"Criar uma regra de nunca dirigir após álcool",fr:"Adopter une règle de zéro conduite après alcool"},
 {en:"Pray for those you endangered",es:"Rezar por quienes pusiste en peligro",pt:"Rezar por aqueles que você colocou em perigo",fr:"Prier pour ceux que vous avez mis en danger"},
 {en:"Go to Confession and complete the priest-assigned penance",es:"Ir a Confesión y cumplir la penitencia asignada por el sacerdote",pt:"Ir à Confissão e cumprir a penitência dada pelo sacerdote",fr:"Aller se confesser et accomplir la pénitence donnée par le prêtre"}
],
prevent:{
avoid:{en:"Do not leave the decision about driving until after you have been drinking.",es:"No dejes la decisión de conducir para después de haber bebido.",pt:"Não deixe a decisão sobre dirigir para depois de beber.",fr:"Ne remettez pas la décision de conduire à après avoir bu."},
do:{en:"Before drinking, leave the keys at home, book a taxi, or choose a sober driver.",es:"Antes de beber, deja las llaves en casa, reserva un taxi o elige un conductor sobrio.",pt:"Antes de beber, deixe as chaves em casa, reserve um táxi ou escolha um motorista sóbrio.",fr:"Avant de boire, laissez les clés à la maison, réservez un taxi ou choisissez un conducteur sobre."},
scripture:{en:"Romans 13:10 — Love does no harm to a neighbor.",es:"Romanos 13:10 — El amor no hace mal al prójimo.",pt:"Romanos 13:10 — O amor não faz mal ao próximo.",fr:"Romains 13,10 — L’amour ne fait aucun mal au prochain."}
}},
lie:{
title:{en:"Lying or deception",es:"Mentira o engaño",pt:"Mentira ou engano",fr:"Mensonge ou tromperie"},sev:"uncertain",sevText:{en:"Seriousness depends on circumstances",es:"La gravedad depende de las circunstancias",pt:"A gravidade depende das circunstâncias",fr:"La gravité dépend des circonstances"},
teaching:{en:"The gravity of a lie depends on the truth distorted, circumstances, intention, and harm.",es:"La gravedad de una mentira depende de la verdad deformada, las circunstancias, la intención y el daño.",pt:"A gravidade de uma mentira depende da verdade distorcida, das circunstâncias, da intenção e do dano.",fr:"La gravité d’un mensonge dépend de la vérité déformée, des circonstances, de l’intention et du tort causé."},source:"Catechism §§2482–2484",
assessment:{en:"A lie can be venial or grave depending on seriousness and harm.",es:"Una mentira puede ser venial o grave según su gravedad y daño.",pt:"Uma mentira pode ser venial ou grave dependendo da gravidade e do dano.",fr:"Un mensonge peut être véniel ou grave selon sa gravité et le tort causé."},
next:{en:"Acknowledge the lie before God, repair harm where reasonably possible, and consider Confession especially if serious harm was caused.",es:"Reconoce la mentira ante Dios, repara el daño cuando sea razonablemente posible y considera la Confesión, especialmente si hubo daño serio.",pt:"Reconheça a mentira diante de Deus, repare o dano quando possível e considere a Confissão, especialmente se houve dano sério.",fr:"Reconnaissez le mensonge devant Dieu, réparez le tort lorsque c’est raisonnablement possible et envisagez la Confession, surtout si le tort est sérieux."},
priest:{en:"A priest can help judge the seriousness pastorally and gives absolution in Confession.",es:"Un sacerdote puede ayudar a valorar pastoralmente la gravedad y da la absolución en la Confesión.",pt:"Um sacerdote pode ajudar a avaliar pastoralmente a gravidade e dá a absolvição na Confissão.",fr:"Un prêtre peut aider à discerner pastoralement la gravité et donne l’absolution en Confession."},
prayer:"contrition",
bible:{
 recognize:{ref:"Ephesians 4:25",text:{en:"Wherefore putting away lying, speak ye the truth every man with his neighbour.",es:"Desechando la mentira, hable cada uno verdad con su prójimo.",pt:"Deixando a mentira, fale cada um a verdade com o seu próximo.",fr:"Rejetant le mensonge, que chacun dise la vérité à son prochain."},why:{en:"It identifies truthfulness as a concrete duty toward other people.",es:"Identifica la veracidad como un deber concreto hacia los demás.",pt:"Mostra a verdade como dever concreto para com os outros.",fr:"Il présente la vérité comme un devoir concret envers autrui."}},
 repent:{ref:"Psalm 50 (51):3",text:{en:"Have mercy on me, O God, according to thy great mercy.",es:"Ten misericordia de mí, oh Dios, según tu gran misericordia.",pt:"Tem misericórdia de mim, ó Deus, segundo a tua grande misericórdia.",fr:"Ayez pitié de moi, ô Dieu, selon votre grande miséricorde."},why:{en:"Repentance begins by asking for mercy rather than hiding the wrong.",es:"El arrepentimiento comienza pidiendo misericordia en vez de ocultar el mal.",pt:"O arrependimento começa pedindo misericórdia em vez de esconder o erro.",fr:"Le repentir commence par demander miséricorde plutôt que cacher la faute."}},
 change:{ref:"Proverbs 12:22",text:{en:"Lying lips are an abomination to the Lord: but they that deal faithfully please him.",es:"Los labios mentirosos son abominación al Señor; los que obran fielmente le agradan.",pt:"Os lábios mentirosos são abominação ao Senhor; os que agem com fidelidade lhe agradam.",fr:"Les lèvres mensongères sont en abomination au Seigneur; ceux qui agissent fidèlement lui plaisent."},why:{en:"The goal is not merely to stop one lie, but to become a person whose ordinary pattern is fidelity and truth.",es:"La meta no es sólo detener una mentira, sino convertirse en una persona fiel y veraz.",pt:"O objetivo não é apenas parar uma mentira, mas tornar-se uma pessoa fiel e verdadeira.",fr:"Le but n’est pas seulement d’arrêter un mensonge, mais de devenir une personne fidèle et vraie."}}
},
tasks:[
{en:"Acknowledge the lie honestly",es:"Reconocer la mentira con honestidad",pt:"Reconhecer a mentira com honestidade",fr:"Reconnaître honnêtement le mensonge"},
{en:"Repair the harm where possible",es:"Reparar el daño cuando sea posible",pt:"Reparar o dano quando possível",fr:"Réparer le tort lorsque c’est possible"},
{en:"Pray the Act of Contrition",es:"Rezar el Acto de Contrición",pt:"Rezar o Ato de Contrição",fr:"Prier l’Acte de contrition"}
],prevent:{avoid:{en:"Avoid quick lies used to escape discomfort.",es:"Evita mentiras rápidas para escapar de la incomodidad.",pt:"Evite mentiras rápidas para escapar do desconforto.",fr:"Évitez les mensonges rapides pour fuir l’inconfort."},do:{en:"Pause before answering and choose a truthful, charitable response.",es:"Haz una pausa antes de responder y elige una respuesta veraz y caritativa.",pt:"Faça uma pausa antes de responder e escolha uma resposta verdadeira e caridosa.",fr:"Faites une pause avant de répondre et choisissez une réponse vraie et charitable."},scripture:{en:"Ephesians 4:25 — Put away falsehood; speak truth.",es:"Efesios 4:25 — Desechen la mentira y digan la verdad.",pt:"Efésios 4:25 — Abandonem a falsidade e falem a verdade.",fr:"Éphésiens 4,25 — Rejetez le mensonge et dites la vérité."}}}
};
R.mass=R.lie; R.cruel=R.lie; R.generic=R.lie;

function tr(k){return T[currentLang][k]||T.en[k]||k}
function applyI18n(){
 document.documentElement.lang=currentLang;
 $$("[data-i18n]").forEach(el=>el.textContent=tr(el.dataset.i18n));
 $$("[data-i18n-placeholder]").forEach(el=>el.placeholder=tr(el.dataset.i18nPlaceholder));
 renderPrayerGrid(); renderJourneys(); renderChart();
}

async function checkBackendStatus(){
  try{
    const r=await fetch("/api/status"); const d=await r.json();
    const el=$("#aiStatus");
    if(!el)return;
    el.textContent=d.openai_configured?"AI ready":"AI setup required";
    el.style.background=d.openai_configured?"#e6f2e9":"#f5ead9";
    el.style.color=d.openai_configured?"#3f654a":"#80633a";
  }catch(e){}
}
function genericPrayerFromAI(p){
  if(!p)return "";
  return `<button class="prayer-link" id="aiPrayerOpen">${escapeHtml(p.title||"Suggested prayer")} →</button>`;
}
function renderAIResponse(d,raw){
 const analysis=d.analysis;
 currentAnalysisJourneyId=null;
 const r={
   title:{[currentLang]:analysis.title},
   sev:analysis.severity==="grave"?"grave":"uncertain",
   sevText:{[currentLang]:analysis.severity_label},
   teaching:{[currentLang]:analysis.catholic_teaching},
   source:(analysis.catechism_refs||[]).length?("Catechism §"+analysis.catechism_refs.join(", §")):"Catholic moral teaching",
   assessment:{[currentLang]:analysis.assessment},
   next:{[currentLang]:analysis.next_step_summary},
   priest:{[currentLang]:analysis.priest_only},
   prayer:"contrition",
   tasks:(analysis.actions||[]).map(x=>({[currentLang]:x})),
   bible:null
 };
 const journey=ensureAnalysisJourney(r);
 // override key and persist AI payload
 let all=getJourneys(); let item=all.find(x=>x.id===journey.id);
 item.key="ai"; item.ai=analysis; item.done=Array(r.tasks.length).fill(false);
 item.bibleDone={};
 (analysis.scripture||[]).forEach((s,i)=>item.bibleDone["s"+i]=false);
 setJourneys(all);
 const scripture=(analysis.scripture||[]).map((s,i)=>`
   <div class="bible-reading" data-bible-card="s${i}">
     <span class="purpose">${escapeHtml(s.purpose||"Scripture")}</span><span class="completed-badge">${tr("completed_step")}</span>
     <h4>${escapeHtml(s.reference||"")}</h4>
     <blockquote>${escapeHtml(s.text||"")}</blockquote>
     <p><strong>${tr("why_this")}:</strong> ${escapeHtml(s.why||"")}</p>
     <button class="secondary ai-scripture-audio" data-si="${i}">${tr("listen")}</button>
     <div class="bible-complete-row"><label><input type="checkbox" data-ai-bible-complete="s${i}"> ${tr("complete_step")}</label></div>
   </div>`).join("");
 $("#chat").innerHTML=`<div class="user-message">${escapeHtml(raw)}</div>
 <div class="ai-response card">
 <span class="severity ${r.sev}">${escapeHtml(analysis.severity_label)}</span><span class="ai-generated-tag">AI + Catholic Bible retrieval</span>
 <h3>${escapeHtml(analysis.title)}</h3>
 <div class="section-block"><strong>${tr("church_teaching")}</strong><p>${escapeHtml(analysis.catholic_teaching)}</p>
 ${(analysis.catechism_refs||[]).map(x=>`<button class="source-chip clickable ai-cat" data-ref="${x}">Catechism §${x} →</button>`).join(" ")}</div>
 <div class="section-block"><strong>${tr("possible_assessment")}</strong><p>${escapeHtml(analysis.assessment)}</p></div>
 <div class="section-block"><strong>${tr("action_plan")}</strong><div class="action-plan">
 ${(analysis.actions||[]).map((x,i)=>`<label class="action-row" data-analysis-step="${i}"><input class="action-check" type="checkbox" data-analysis-check="${i}"><span>${i+1}</span><span>${escapeHtml(x)}<div class="action-meta"><small class="inline-status" data-analysis-label="${i}">${tr("complete_step")}</small></div></span></label>`).join("")}
 </div></div>
 <div class="section-block"><strong>${tr("bible_reading")}</strong><div class="bible-section">${scripture}</div></div>
 <div class="section-block"><strong>${tr("what_now")}</strong><p>${escapeHtml(analysis.next_step_summary)}</p></div>
 <div class="section-block"><strong>${tr("prayer_now")}</strong>${genericPrayerFromAI(analysis.prayer)}</div>
 <div class="section-block"><strong>Prevention</strong><div class="prevent-grid">
 <div class="prevent"><strong>${tr("avoid")}</strong><p>${escapeHtml(analysis.prevention?.avoid||"")}</p></div>
 <div class="prevent"><strong>${tr("do_instead")}</strong><p>${escapeHtml(analysis.prevention?.do_instead||"")}</p></div>
 <div class="prevent"><strong>${tr("scripture")}</strong><p>${escapeHtml(analysis.prevention?.spiritual_practice||"")}</p></div></div></div>
 <div class="section-block"><strong>Confession preparation</strong><p>${escapeHtml(analysis.confession_words||"")}</p></div>
 <div class="section-block"><strong>${tr("priest_only")}</strong><p>${escapeHtml(analysis.priest_only)}</p></div>
 <div class="audio-row"><button class="secondary" id="listenOutcome">${tr("listen_outcome")}</button></div>
 </div>`;
 $$("[data-analysis-check]").forEach(c=>c.onchange=()=>toggleAnalysisStep(+c.dataset.analysisCheck,c.checked));
 $$("[data-ai-bible-complete]").forEach(c=>c.onchange=()=>toggleAIBible(c.dataset.aiBibleComplete,c.checked));
 $$(".ai-cat").forEach(b=>b.onclick=()=>openCatechism(b.dataset.ref));
 $$(".ai-scripture-audio").forEach(b=>b.onclick=()=>{const s=analysis.scripture[+b.dataset.si];speak(`${s.reference}. ${s.text}. ${s.why}`)});
 $("#listenOutcome").onclick=()=>speak([
   analysis.title,analysis.catholic_teaching,analysis.assessment,
   ...(analysis.actions||[]),...(analysis.scripture||[]).map(s=>`${s.reference}. ${s.text}. ${s.why}`),
   analysis.next_step_summary,analysis.prevention?.avoid,analysis.prevention?.do_instead,
   analysis.confession_words
 ].filter(Boolean).join(". "));
 if($("#aiPrayerOpen"))$("#aiPrayerOpen").onclick=()=>openAIPrayer(analysis.prayer);
 renderJourneys();renderChart();
}
function openAIPrayer(p){
 activePrayerId=null;
 $("#prayerTitle").textContent=p?.title||"Suggested prayer";
 $("#prayerText").textContent=p?.text||"";
 $("#prayerModal").hidden=false;
 $("#speakPrayer").onclick=()=>speak(p?.text||"");
}
function toggleAIBible(k,checked){
 let all=getJourneys(); const item=all.find(x=>x.id===currentAnalysisJourneyId); if(!item)return;
 item.bibleDone=item.bibleDone||{}; item.bibleDone[k]=checked;
 item.closed=item.done.every(Boolean)&&Object.values(item.bibleDone).every(Boolean);
 setJourneys(all);
 const card=document.querySelector(`[data-bible-card="${k}"]`); if(card)card.classList.toggle("completed",checked);
 const cb=document.querySelector(`[data-ai-bible-complete="${k}"]`);
 if(cb && cb.parentElement) cb.parentElement.lastChild.textContent=" "+(checked?tr("completed_step"):tr("complete_step"));
 renderJourneys();renderChart();
}
async function analyzeWithAI(raw){
 $("#chat").innerHTML=`<div class="user-message">${escapeHtml(raw)}</div><div class="card ai-response"><p>Analyzing the situation against Catholic teaching and searching the Catholic Bible…</p></div>`;
 try{
   const res=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:raw,lang:currentLang})});
   const d=await res.json();
   if(!res.ok)throw new Error(d.error||"AI analysis unavailable");
   renderAIResponse(d,raw);
 }catch(e){
   $("#chat").innerHTML+=`<div class="error-card">${escapeHtml(e.message)}<br><a class="setup-cta" href="/setup">Open AI & Voice Setup</a></div>`;
 }
}
function classify(t){
 t=t.toLowerCase();
 if((/driv|condu|dirig/.test(t))&&(/drunk|drink|alcohol|intoxic|beb|ebri|ivresse/.test(t))) return R.drunk;
 if(/lie|lied|menti|mensong|enga|mentir/.test(t)) return R.lie;
 return R.generic;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),1700)}
async function speak(text){
  try{
    const res=await fetch("/api/tts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text,lang:currentLang})});
    if(!res.ok){
      const data=await res.json().catch(()=>({}));
      toast(data.error||"Natural neural voice is not configured.");
      return;
    }
    const blob=await res.blob();
    const url=URL.createObjectURL(blob);
    const audio=new Audio(url);
    audio.playbackRate=.93;
    audio.onended=()=>URL.revokeObjectURL(url);
    await audio.play();
  }catch(e){toast("Natural neural voice is not available. Start the v0.5 backend and configure the TTS key.");}
}
function responseText(r){
 return [r.title[currentLang],tr("church_teaching"),r.teaching[currentLang],tr("possible_assessment"),r.assessment[currentLang],tr("what_now"),r.next[currentLang],tr("priest_only"),r.priest[currentLang]].join(". ");
}

let currentAnalysisKey=null;
let currentAnalysisJourneyId=null;

function keyForResponse(r){
  if(r===R.drunk)return "drunk";
  if(r===R.lie)return "lie";
  return "lie";
}
function ensureAnalysisJourney(r){
  const key=keyForResponse(r);
  let all=getJourneys();
  if(currentAnalysisJourneyId){
    const existing=all.find(x=>x.id===currentAnalysisJourneyId);
    if(existing && existing.key===key)return existing;
  }
  const item={id:Date.now(),key:key,done:Array(r.tasks.length).fill(false),bibleDone:{recognize:false,repent:false,change:false},created:new Date().toISOString(),closed:false};
  all.unshift(item); setJourneys(all);
  currentAnalysisJourneyId=item.id; currentAnalysisKey=key;
  return item;
}
function getAnalysisJourney(){
  return getJourneys().find(x=>x.id===currentAnalysisJourneyId) || null;
}
function toggleAnalysisStep(i,checked){
  let all=getJourneys();
  const item=all.find(x=>x.id===currentAnalysisJourneyId);
  if(!item)return;
  item.done[i]=checked; item.closed=item.done.every(Boolean) && (!item.bibleDone || Object.values(item.bibleDone).every(Boolean));
  setJourneys(all); renderJourneys(); renderChart();
  const row=document.querySelector(`[data-analysis-step="${i}"]`);
  if(row)row.classList.toggle("done",checked);
  const label=document.querySelector(`[data-analysis-label="${i}"]`);
  if(label)label.textContent=checked?tr("completed_step"):tr("complete_step");
}
function renderBible(r){
 if(!r.bible)return "";
 const journey=getAnalysisJourney();
 const parts=[["recognize",tr("recognize")],["repent",tr("repent")],["change",tr("change")]];
 return `<div class="bible-section">${parts.map(([k,label])=>{
   const b=r.bible[k];
   const done=!!(journey && journey.bibleDone && journey.bibleDone[k]);
   return `<div class="bible-reading ${done?"completed":""}" data-bible-card="${k}">
     <span class="purpose">${label}</span><span class="completed-badge">${tr("completed_step")}</span>
     <h4>${b.ref}</h4><blockquote>${b.text[currentLang]}</blockquote>
     <p><strong>${tr("why_this")}:</strong> ${b.why[currentLang]}</p>
     <button class="secondary bible-audio" data-bible="${k}">${tr("listen")}</button>
     <div class="bible-complete-row">
       <label><input type="checkbox" data-bible-complete="${k}" ${done?"checked":""}> ${done?tr("completed_step"):tr("complete_step")}</label>
     </div>
   </div>`;
 }).join("")}
 <div class="full-bible-box">
   <strong>Search the complete Catholic Bible</strong>
   <p>The v0.5 backend can search the full public-domain Original Douay–Rheims corpus for additional passages related to this situation.</p>
   <button class="secondary" id="searchWholeBible">Find more related Scripture</button>
   <div class="full-bible-results" id="fullBibleResults"></div>
 </div></div>`;
}function renderResponse(r,raw){
 const journey=ensureAnalysisJourney(r);
 $("#chat").innerHTML=`<div class="user-message">${escapeHtml(raw)}</div>
 <div class="ai-response card">
 <span class="severity ${r.sev}">${r.sevText[currentLang]}</span>
 <h3>${r.title[currentLang]}</h3>
 <div class="section-block"><strong>${tr("church_teaching")}</strong><p>${r.teaching[currentLang]}</p><button class="source-chip clickable" id="catechismSource">${r.source} →</button></div>
 <div class="section-block"><strong>${tr("possible_assessment")}</strong><p>${r.assessment[currentLang]}</p></div>
 <div class="section-block"><strong>${tr("action_plan")}</strong>
   <div class="action-plan">
   ${r.tasks.map((task,i)=>`<label class="action-row ${journey.done[i]?"done":""}" data-analysis-step="${i}">
      <input class="action-check" type="checkbox" data-analysis-check="${i}" ${journey.done[i]?"checked":""}>
      <span>${i+1}</span>
      <span>${task[currentLang]}<div class="action-meta"><small class="inline-status" data-analysis-label="${i}">${journey.done[i]?tr("completed_step"):tr("complete_step")}</small></div></span>
   </label>`).join("")}
   </div>
 </div>
 <div class="section-block"><strong>${tr("bible_reading")}</strong>${renderBible(r)}</div>
 <div class="section-block"><strong>${tr("what_now")}</strong><p>${r.next[currentLang]}</p></div>
 <div class="section-block"><strong>${tr("prayer_now")}</strong><button class="prayer-link" data-prayer="${r.prayer}">${PRAYERS[r.prayer].title[currentLang]} →</button></div>
 <div class="section-block"><strong>${tr("priest_only")}</strong><p>${r.priest[currentLang]}</p></div>
 <div class="audio-row"><button class="secondary" id="listenOutcome">${tr("listen_outcome")}</button></div>
 <div class="voice-quality"><strong>${tr("voice_quality_title")}</strong>${tr("voice_quality_desc")}</div>
 </div>`;
 $("#listenOutcome").onclick=()=>speak(responseText(r));
 $(".prayer-link").onclick=e=>openPrayer(e.target.dataset.prayer);
 $$(".bible-audio").forEach(b=>b.onclick=()=>{const x=r.bible[b.dataset.bible];speak(x.ref+". "+x.text[currentLang]+". "+x.why[currentLang])});
 $$("[data-analysis-check]").forEach(c=>c.onchange=()=>toggleAnalysisStep(+c.dataset.analysisCheck,c.checked));
 $("#catechismSource").onclick=()=>openCatechism(r.source.replace("Catechism ","").replace("§§","").replace("§","").split("–")[0]);
 $$("[data-bible-complete]").forEach(c=>c.onchange=()=>toggleBibleCompletion(c.dataset.bibleComplete,c.checked));
 const searchBtn=$("#searchWholeBible"); if(searchBtn)searchBtn.onclick=()=>searchWholeBible(raw);
}

function toggleBibleCompletion(k,checked){
  let all=getJourneys();
  const item=all.find(x=>x.id===currentAnalysisJourneyId);
  if(!item)return;
  item.bibleDone=item.bibleDone||{recognize:false,repent:false,change:false};
  item.bibleDone[k]=checked;
  item.closed=item.done.every(Boolean)&&Object.values(item.bibleDone).every(Boolean);
  setJourneys(all); renderJourneys(); renderChart();
  const card=document.querySelector(`[data-bible-card="${k}"]`);
  if(card)card.classList.toggle("completed",checked);
  const label=document.querySelector(`[data-bible-complete="${k}"]`)?.parentElement;
  if(label)label.childNodes[label.childNodes.length-1].textContent=" "+(checked?tr("completed_step"):tr("complete_step"));
}
async function searchWholeBible(raw){
  const out=$("#fullBibleResults");
  if(!out)return;
  out.innerHTML="<p>Searching the complete Bible…</p>";
  try{
    const res=await fetch("/api/bible/recommend",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:raw,lang:currentLang})});
    const data=await res.json();
    if(!res.ok)throw new Error(data.error||"Bible search unavailable");
    const rows=(data.results||[]).slice(0,6);
    out.innerHTML=rows.length?rows.map(x=>`<div class="full-bible-result"><strong>${x.reference||x.heading}</strong><p>${x.text||""}</p></div>`).join(""):"<p>No additional passages found.</p>";
  }catch(e){out.innerHTML=`<p>${e.message}. Start <b>server.py</b> to enable the complete-Bible backend.</p>`;}
}
async function openCatechism(ref){
  $("#catechismModal").hidden=false;
  $("#catechismTitle").textContent=`Catechism ${ref}`;
  $("#catechismBody").textContent="Loading the cited Catholic Catechism paragraph…";
  try{
    const res=await fetch(`/api/catechism?ref=${encodeURIComponent(ref)}&lang=${currentLang}`);
    const d=await res.json();
    if(!res.ok)throw new Error(d.error||"Unavailable");
    $("#catechismBody").textContent=d.text;
    $("#officialCatechismLink").href=d.official_url;
    $("#listenCatechism").onclick=()=>speak(d.text);
  }catch(e){
    $("#catechismBody").textContent="The official Catechism text requires the v0.5 backend and an internet connection. You can still open the authoritative Vatican source.";
    $("#officialCatechismLink").href="https://www.vatican.va/content/catechism/en.html";
  }
}
function getJourneys(){try{return JSON.parse(localStorage.getItem("cc_journeys")||"[]")}catch{return []}}
function setJourneys(j){localStorage.setItem("cc_journeys",JSON.stringify(j))}
function saveJourney(r){
 let j=getJourneys();
 j.unshift({id:Date.now(),key:r===R.drunk?"drunk":"lie",done:Array(r.tasks.length).fill(false),bibleDone:{recognize:false,repent:false,change:false},created:new Date().toISOString(),closed:false});
 setJourneys(j); renderJourneys(); renderChart(); toast(tr("save_journey"));
}
function renderJourneys(){
 const list=$("#journeyList"); if(!list)return;
 const j=getJourneys();
 if(!j.length){list.innerHTML=`<div class="card journey-card"><p style="color:#6d747b">No journeys yet. Save a guidance outcome to begin.</p></div>`; updateMetrics(); return}
 list.innerHTML=j.map(x=>{
   const r=(x.key==="ai"&&x.ai)?{title:{[currentLang]:x.ai.title},tasks:(x.ai.actions||[]).map(a=>({[currentLang]:a})),prevent:{avoid:{[currentLang]:x.ai.prevention?.avoid||""},do:{[currentLang]:x.ai.prevention?.do_instead||""},scripture:{[currentLang]:x.ai.prevention?.spiritual_practice||""}}}:R[x.key]||R.lie, done=x.done.filter(Boolean).length, bibleDone=x.bibleDone?Object.values(x.bibleDone).filter(Boolean).length:0, closed=done===x.done.length && bibleDone===Object.keys(x.bibleDone||{}).length;
   return `<article class="card journey-card">
   <div class="journey-head"><div><span class="eyebrow">${closed?tr("closed"):tr("opened")}</span><h3>${r.title[currentLang]}</h3></div><span class="progress-pill">${done+bibleDone}/${x.done.length+3} ${tr("progress")}</span></div>
   <div class="task-list">${r.tasks.map((task,i)=>`<label class="task"><input type="checkbox" data-jid="${x.id}" data-ti="${i}" ${x.done[i]?"checked":""}><span>${task[currentLang]}</span></label>`).join("")}</div>
   <div class="prevent-grid"><div class="prevent"><strong>${tr("avoid")}</strong><p>${r.prevent.avoid[currentLang]}</p></div><div class="prevent"><strong>${tr("do_instead")}</strong><p>${r.prevent.do[currentLang]}</p></div><div class="prevent"><strong>${tr("scripture")}</strong><p>${r.prevent.scripture[currentLang]}</p></div></div>
   </article>`;
 }).join("");
 $$('input[type="checkbox"][data-jid]').forEach(c=>c.onchange=()=>{
   const all=getJourneys(), item=all.find(y=>y.id==c.dataset.jid); item.done[+c.dataset.ti]=c.checked; item.closed=item.done.every(Boolean) && (!item.bibleDone || Object.values(item.bibleDone).every(Boolean)); setJourneys(all); renderJourneys(); renderChart();
 });
 updateMetrics();
}
function updateMetrics(){
 const j=getJourneys(), closed=j.filter(x=>x.done.every(Boolean)).length, open=j.length-closed;
 $("#openMetric").textContent=open; $("#closedMetric").textContent=closed; $("#completionMetric").textContent=j.length?Math.round(closed/j.length*100)+"%":"0%";
}
function renderChart(){
 const chart=$("#chart"); if(!chart)return;
 const demo=[{m:"Mar",o:3,c:1},{m:"Apr",o:4,c:2},{m:"May",o:2,c:2},{m:"Jun",o:5,c:3},{m:"Jul",o:3,c:2},{m:"Aug",o:Math.max(1,getJourneys().length),c:getJourneys().filter(x=>x.done.every(Boolean)).length}];
 chart.innerHTML=demo.map(d=>`<div class="bar-group"><div class="bar opened" style="height:${d.o*28}px" title="Opened ${d.o}"></div><div class="bar closed" style="height:${Math.max(4,d.c*28)}px" title="Completed ${d.c}"></div><span class="bar-label">${d.m}</span></div>`).join("");
 updateMetrics();
}
function renderPrayerGrid(){
 const g=$("#prayerGrid"); if(!g)return;
 g.innerHTML=Object.entries(PRAYERS).map(([id,p])=>`<article class="card prayer-card"><span class="eyebrow">Prayer</span><h3>${p.title[currentLang]}</h3><p>${p.text[currentLang].split("\n")[0].slice(0,120)}…</p><button class="secondary" data-open-prayer="${id}">${tr("full_prayer")} →</button></article>`).join("");
 $$("[data-open-prayer]").forEach(b=>b.onclick=()=>openPrayer(b.dataset.openPrayer));
}
function openPrayer(id){
 activePrayerId=id; const p=PRAYERS[id];
 $("#prayerTitle").textContent=p.title[currentLang]; $("#prayerText").textContent=p.text[currentLang]; $("#prayerModal").hidden=false;
}
$("#closePrayer").onclick=()=>$("#prayerModal").hidden=true;
$("#prayerModal").onclick=e=>{if(e.target===$("#prayerModal"))$("#prayerModal").hidden=true};
$("#speakPrayer").onclick=()=>activePrayerId&&speak(PRAYERS[activePrayerId].text[currentLang]);
$("#markPrayer").onclick=()=>{toast(tr("mark_complete"));$("#prayerModal").hidden=true};

$("#ask").onclick=()=>{const raw=$("#situation").value.trim();if(!raw){toast(tr("guide_title"));return}analyzeWithAI(raw)};if(!raw){toast(tr("guide_title"));return}renderResponse(classify(raw),raw)};
$$("[data-example-key]").forEach(b=>b.onclick=()=>$("#situation").value=EX[currentLang][b.dataset.exampleKey]);
$$(".nav").forEach(b=>b.onclick=()=>{$$(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".view").forEach(v=>v.classList.remove("active-view"));$("#"+b.dataset.view).classList.add("active-view");if(b.dataset.view==="journey")renderJourneys();if(b.dataset.view==="insights")renderChart()});
$("#languageSelect").onchange=e=>{currentLang=e.target.value;applyI18n()};
applyI18n(); renderJourneys();

$("#closeCatechism").onclick=()=>$("#catechismModal").hidden=true;
$("#catechismModal").onclick=e=>{if(e.target===$("#catechismModal"))$("#catechismModal").hidden=true};

checkBackendStatus();
