#!/usr/bin/env python3
"""Daily publisher: promote at most 20 QA-approved AstroVip profiles per Bucharest day."""
from __future__ import annotations
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
import argparse
import json
import os
import sys

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from review_gate import REVIEWS, STATE, check_review, read_state, load_promotions

def run(limit: int, dry_run: bool=False, today: str|None=None) -> dict:
    if not 1<=limit<=20:
        raise ValueError("Daily cap must stay between 1 and 20")
    date = today or datetime.now(ZoneInfo("Europe/Bucharest")).date().isoformat()
    state=read_state()
    indexed = {i["slug"] for i in state["indexed"]}
    prev_today=state["days"].get(date,[])
    if not isinstance(prev_today,list) or len(prev_today)>20:
        raise ValueError("Invalid daily publication ledger")
    available=max(0,limit-len(prev_today))
    already=load_promotions()
    admitted=[]
    rejected=[]
    candidates=sorted(REVIEWS.glob("ascendent-*-soare-*-luna-*.json"))
    for path in candidates:
        if path.stem in indexed:
            continue
        try:
            item=json.loads(path.read_text(encoding="utf-8"))
            sha=check_review(item,path.stem,list(already.values())[-30:]+admitted[-30:])
            item["content_sha256"]=sha
        except Exception as exc:
            rejected.append({"slug":path.stem,"reason":str(exc)[:190]})
            continue
        if len(admitted)<available:
            admitted.append(item)
    for item in admitted:
        state["indexed"].append({"slug":item["slug"],"sha256":item["content_sha256"]})
        prev_today.append(item["slug"])
    if admitted:
        state["days"][date]=prev_today
        if not dry_run:
            STATE.write_text(json.dumps(state,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    result={
        "date_bucharest":date,"daily_cap":limit,
        "previously_released_today":len(prev_today)-len(admitted),
        "approved_promoted_now":len(admitted),
        "total_promoted":len(state["indexed"]),
        "remaining_unpromoted":1704-len(state["indexed"]),
        "eligible_files_found":len(candidates),
        "rejected_count":len(rejected),
        "rejected_examples":rejected[:12],
        "published_urls":["https://astrovip.ro/ascendent-soare-luna/"+i["slug"]+"/" for i in admitted],
        "state_changed":bool(admitted) and not dry_run,
        "dry_run":dry_run,
    }
    return result

def write_summary(result:dict):
    summary = [
        "## AstroVip — publicare progresivă",
        f"Ziua București: {result['date_bucharest']}",
        f"Limita: {result['daily_cap']} pagini/zi",
        f"Pagini aprobate pentru indexare în această rulare: **{result['approved_promoted_now']}**",
        f"Total profiluri promovate: **{result['total_promoted']} din 1.704**",
        f"Fișiere respinse la controlul calității: **{result['rejected_count']}**",
        "Publicare = eligibilitate pentru indexare, nu indexare Google confirmată.",
    ]
    if result["published_urls"]:
        summary.append("### URL-uri aprobate")
        summary += ["- "+u for u in result["published_urls"]]
    if result["rejected_examples"]:
        summary.append("### Exemple respinse")
        summary += ["- "+v["slug"]+": "+v["reason"] for v in result["rejected_examples"]]
    if not result["published_urls"]:
        summary.append("Nu a fost promovată nicio pagină neverificată; noindex rămâne activ.")
    if os.getenv("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"],"a",encoding="utf-8") as f:
            f.write("\n".join(summary)+"\n")
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--limit",type=int,default=20)
    parser.add_argument("--dry-run",action="store_true")
    parser.add_argument("--date",default=None)
    args=parser.parse_args()
    result=run(args.limit,args.dry_run,args.date)
    write_summary(result)
