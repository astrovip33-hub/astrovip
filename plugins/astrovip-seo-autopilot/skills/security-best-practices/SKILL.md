---
name: security-best-practices
description: Security review and secure-by-default guidance for AstroVip code, CI/CD and Cloudflare-related changes. Use for explicit security reviews, secret handling, dependency risk, injection/XSS, unsafe browser code, exposed tokens or risky deployment configuration.
metadata:
  source: https://github.com/openai/skills/tree/main/skills/.curated/security-best-practices
  adapted_for: AstroVip
---

# AstroVip Security Best Practices

Review the AstroVip repository and release path for high-impact security issues without creating unnecessary product regressions.

## Scope

Prioritize JavaScript/TypeScript, HTML/CSS with executable behavior, build scripts, GitHub Actions, Cloudflare configuration and any backend/API code present in the repository.

## Review workflow

1. Identify the languages, frameworks and runtime surfaces actually present.
2. Inspect repository configuration and package/dependency files.
3. Search for secrets and credential-like values in tracked files.
4. Review user-controlled input paths and DOM/API sinks.
5. Review third-party scripts, remote resources and dependency trust.
6. Review CI/CD permissions and secret usage.
7. Review Cloudflare/deployment configuration for overly broad access or exposed credentials.
8. Rank findings by exploitability and impact.
9. Apply one scoped fix at a time and run existing validation after each meaningful change.

## High-priority checks

- API keys, tokens, passwords or private credentials committed to Git;
- client-side exposure of server-only secrets;
- unsafe `innerHTML`, `eval`, dynamic script injection or unsanitized HTML;
- untrusted URL redirects or link targets;
- missing validation on public form/API inputs;
- overly broad GitHub Actions permissions;
- secrets printed to workflow logs;
- mutable or untrusted third-party script sources;
- insecure dependency versions with known exploitable issues;
- Cloudflare tokens with broader permissions than the workflow needs;
- production debug endpoints or verbose error leakage.

## Web-specific guidance

- Prefer text/content APIs over raw HTML insertion.
- Sanitize HTML only when HTML rendering is truly required.
- Validate and normalize externally supplied URLs.
- Keep security headers compatible with the site's actual architecture; do not deploy a strict CSP blindly if it would break required scripts.
- Treat HSTS and account-wide WAF changes as deliberate infrastructure decisions, not routine fixes.
- Use HTTPS and secure cookies in production where applicable, but keep local-development behavior workable.

## CI/CD guidance

- Use least-privilege workflow permissions.
- Keep secrets in GitHub/Cloudflare secret stores, not repository files.
- Avoid echoing secrets or full environment dumps.
- Pin important actions/dependencies appropriately when practical.
- Do not bypass failing security or quality checks just to merge.

## Reporting

For each finding include:

- ID and severity;
- affected file/path;
- evidence;
- realistic impact;
- recommended fix;
- regression risk;
- validation step.

## Guardrails

- Do not claim a vulnerability without evidence.
- Do not expose secret values in reports; redact them.
- Do not rotate/delete credentials unless the user explicitly requests credential remediation.
- Do not make unrelated feature or design changes during a security fix.
- Prefer minimal secure changes that preserve current AstroVip functionality.
