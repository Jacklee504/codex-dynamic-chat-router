# Providers

The runtime has four adapters: authenticated local `codex` and `claude` CLIs,
local Ollama through Codex OSS mode, and optional OpenRouter. The CLI adapters
use their host's existing login. Ollama never downloads a model. OpenRouter is
disabled by default in `config/models.yaml` and supports read-only tasks only.

On macOS, DTR also discovers the CLI bundled with ChatGPT or Codex when `codex`
is absent from Terminal's `PATH`. If you use a non-standard CLI location, set
the non-secret shell variable `DTR_CODEX_COMMAND` to its full executable path
before launching DTR. DTR does not read `.env` files.

To opt in, enable a reviewed OpenRouter model entry and provide its credential
to the DTR process through your shell or operating-system credential launcher.
The runtime reads that process credential only; it does not read `.env` files,
store credentials, print them, or place them in run records. A missing
credential leaves the provider disabled.

`dtr models refresh` may fetch OpenRouter's public model catalog when a
credential is present. It writes only a cache under
`.dtr/cache/`; it never changes model configuration. Cached metadata older than
24 hours is marked stale. Catalog availability does not make a model eligible:
the reviewed local registry remains authoritative.

Remote-provider calls are deliberate, bounded task calls. Use
`--private-code` or `--no-remote` for material that must not leave the machine.
See [privacy](privacy.md) and [adding a provider](adding-a-provider.md).
