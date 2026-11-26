# ADR 003: OpenRouter for the Digital Twin

## Status
Accepted

## Context
The twin needs an LLM, with low cost and resilience to free-tier rate limits.

## Decision
Call OpenRouter's OpenAI-compatible Chat Completions API directly with `fetch` (no SDK), streaming, using a configurable model fallback list.

## Reasons
- One key gives access to many models, including free ones.
- Native `models` fallback absorbs outages and rate limits.
- Plain `fetch` keeps dependencies minimal and the code portable.

## Alternatives considered
- Direct provider SDKs: lock-in and more keys.
- Vercel AI SDK: convenient, but adds a dependency we don't need for one endpoint.

## Consequences
- Free models vary in quality and availability. The model list is env-configurable so it can change without code changes.
