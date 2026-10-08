# -*- coding: utf-8 -*-
"""Run with python3 validate-tokens.py to check the token handoff."""
from pathlib import Path
import json,re
p=Path(__file__).resolve().parent
d=json.loads((p/'tokens.json').read_text())
tokens={t['name']:t for t in d['tokens']}
assert len(tokens)==len(d['tokens']), 'Duplicate token names'
css=dict(re.findall(r'(--ms-[\w-]+)\s*:\s*([^;]+);',(p/'tokens.css').read_text()))
for name,t in tokens.items():
    assert t['css'] in css,name
    seen={name};ref=t
    while 'alias' in ref:
        key=ref['alias'];assert key in tokens and key not in seen,name
        seen.add(key);ref=tokens[key]
    if 'alias' in t:
        assert css[t['css']]=='var('+tokens[t['alias']]['css']+')',name
    else:
        unit='' if name.startswith('opacity/') else 'ms' if name.startswith('motion/') else 'px'
        value=str(t['value'])+(unit if t['type']=='FLOAT' else '')
        assert css[t['css']]==value,name
    assert 'ALL_SCOPES' not in t['scopes'],name
assert all(c['ratio']>=4.5 for c in json.loads((p/'validation.json').read_text())['contrast'])
h=json.loads((p/'figma-handoff.json').read_text())
assert h['validation']['tokenCount']==len(tokens)
assert all(s['linkedInstances']==s['instanceCount'] and not s['wrongFonts'] and s['imageCount']==(1 if s['id'] in {'34:873','34:918','34:964','34:1010'} else 0) for s in h['validation']['screens'])
print('PASS:',len(tokens),'tokens; CSS values, aliases, scopes, contrast and Figma handoff agree')
