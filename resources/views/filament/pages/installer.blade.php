<div class="nlm-installer-page">
    {{-- Decorative overlays --}}
    <div class="nlm-scanlines" aria-hidden="true"></div>
    <div class="nlm-grid-bg" aria-hidden="true"></div>

    <div class="nlm-installer-root">

        {{-- ── LEFT PANEL: BRANDING ───────────────────────── --}}
        <aside class="nlm-brand">
            <div>
                <div class="nlm-brand-top">
                    <span class="nlm-badge">[SYS//INIT]</span>
                    <span>{{ date('Y.m.d') }}</span>
                </div>
                <div class="nlm-boot-bar" aria-hidden="true">
                    <div class="nlm-boot-bar-fill"></div>
                </div>
            </div>

            <div class="nlm-brand-main">
                <p class="nlm-brand-eyebrow">// Initialize Sequence</p>
                <h1 class="nlm-brand-title">NLM<br>PANEL</h1>
                <span class="nlm-brand-rule" aria-hidden="true"></span>
                <p class="nlm-brand-sub">
                    SYSTEM INSTALLATION<br>
                    PROTOCOL&nbsp;—&nbsp;AWAITING<br>
                    INPUT PARAMETERS
                </p>
            </div>

            <div class="nlm-brand-meta">
                <div class="nlm-meta-row">
                    <span class="nlm-meta-key">PHP</span>
                    <span class="nlm-meta-val">{{ PHP_VERSION }}</span>
                </div>
                <div class="nlm-meta-row">
                    <span class="nlm-meta-key">FRAMEWORK</span>
                    <span class="nlm-meta-val">Laravel {{ app()->version() }}</span>
                </div>
                <div class="nlm-meta-row">
                    <span class="nlm-meta-key">STEPS</span>
                    <span class="nlm-meta-val">7 SEQUENCES</span>
                </div>
                <div class="nlm-meta-row">
                    <span class="nlm-meta-key">STATUS</span>
                    <span class="nlm-meta-val nlm-meta-val--active">INIT_READY</span>
                </div>
            </div>
        </aside>

        {{-- ── RIGHT PANEL: WIZARD FORM ───────────────────── --}}
        <main class="nlm-main">
            {{-- Terminal top bar --}}
            <div class="nlm-terminal-bar">
                <div class="nlm-terminal-dots" aria-hidden="true">
                    <div class="nlm-terminal-dot"></div>
                    <div class="nlm-terminal-dot"></div>
                    <div class="nlm-terminal-dot"></div>
                </div>
                <span class="nlm-terminal-path">
                    <span>root@nlmanager</span>:/var/www/panel#&nbsp;install_panel --init
                </span>
                <span class="nlm-terminal-status">7 STEPS</span>
            </div>

            {{-- Form wizard --}}
            <div class="nlm-form-content">
                <form wire:submit="submit">
                    {{ $this->form }}
                </form>
            </div>
        </main>

    </div>

    <x-filament-actions::modals />

</div>{{-- .nlm-installer-page --}}
