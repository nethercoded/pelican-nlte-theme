<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="{{ config('app.favicon') }}" />
    <title>{{ $code }} // {{ $title }} — {{ config('app.name') }}</title>
    <style>
        *,::before,::after{box-sizing:border-box;margin:0;padding:0}
        :root{
            --bg:#000;--surface:#0a0a0a;--charcoal:#12100e;
            --border:#262421;--bone:#E3D5CA;--dust:#5e5a56;--gold:#D4A373;
            --mono:'Courier New',monospace;
        }
        html,body{height:100%}
        body{
            background:var(--bg);color:var(--bone);
            font-family:var(--mono);
            display:flex;flex-direction:column;
            align-items:center;justify-content:center;
            min-height:100vh;overflow:hidden;
        }
        /* scanlines */
        body::before{
            content:'';position:fixed;inset:0;
            background:repeating-linear-gradient(0deg,rgba(0,0,0,.06) 0px,rgba(0,0,0,.06) 1px,transparent 1px,transparent 4px);
            pointer-events:none;z-index:0;
        }
        /* vignette */
        body::after{
            content:'';position:fixed;inset:0;
            background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.75) 100%);
            pointer-events:none;z-index:0;
        }
        .frame{
            position:relative;z-index:1;
            max-width:560px;width:100%;padding:0 1.5rem;
            animation:rise .5s ease both;
        }
        @keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .topline{
            font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;
            color:var(--dust);margin-bottom:1.5rem;
            display:flex;align-items:center;gap:.6rem;
        }
        .topline::before{
            content:'';display:block;height:1px;flex:1;background:var(--border);
        }
        .code{
            font-size:clamp(4rem,16vw,7rem);font-weight:900;
            color:var(--gold);line-height:1;letter-spacing:-.04em;
            animation:flicker 6s linear infinite;
            text-shadow:0 0 40px rgba(212,163,115,.18);
            position:relative;display:inline-block;
        }
        .code::after{
            content:attr(data-code);
            position:absolute;inset:0;
            color:var(--gold);opacity:.08;
            transform:translate(3px,3px);
            z-index:-1;
        }
        @keyframes flicker{0%,19%,21%,23%,25%,54%,56%,100%{opacity:1}20%,24%,55%{opacity:.6}}
        .title{
            font-size:.82rem;letter-spacing:.16em;text-transform:uppercase;
            color:var(--bone);margin:.5rem 0 1.25rem;
        }
        .divider{
            height:1px;background:var(--border);margin:.75rem 0;
            position:relative;overflow:visible;
        }
        .divider::after{
            content:'';position:absolute;left:0;top:-1px;
            width:60px;height:2px;background:var(--gold);
        }
        .subtitle{
            font-size:.78rem;color:var(--dust);line-height:1.7;
            margin-bottom:1.75rem;
        }
        .actions{display:flex;gap:.75rem;flex-wrap:wrap;}
        .btn{
            display:inline-flex;align-items:center;gap:.45rem;
            font-family:var(--mono);font-size:.65rem;
            letter-spacing:.12em;text-transform:uppercase;
            padding:.55rem 1.1rem;
            border:1px solid var(--border);color:var(--bone);
            text-decoration:none;
            transition:border-color .15s,color .15s,background .15s;
            background:transparent;cursor:pointer;
        }
        .btn:hover{border-color:var(--gold);color:var(--gold);}
        .btn-primary{
            background:var(--gold);color:var(--bg);border-color:var(--gold);
        }
        .btn-primary:hover{background:transparent;color:var(--gold);}
        .prompt{
            display:flex;align-items:center;gap:.5rem;
            margin-top:2rem;font-size:.62rem;color:var(--dust);
            letter-spacing:.06em;
        }
        .prompt-cursor{
            display:inline-block;width:8px;height:.8em;
            background:var(--gold);animation:blink 1.2s step-start infinite;
        }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    </style>
</head>
<body>
    <div class="frame">
        <div class="topline">{{ config('app.name') }} · system</div>

        <div class="code" data-code="{{ $code }}">{{ $code }}</div>

        <div class="title">{{ $title }}</div>

        <div class="divider"></div>

        <p class="subtitle">
            @php
                $msg = $subtitle instanceof \Closure ? $subtitle() : $subtitle;
            @endphp
            {{ $msg ?: 'An unexpected system anomaly has been detected. The requested resource could not be resolved.' }}
        </p>

        <div class="actions">
            <a href="/" class="btn btn-primary">← Dashboard</a>
            <a href="javascript:history.back()" class="btn">&#x21A9; Go Back</a>
        </div>

        <div class="prompt">
            <span>nlm@system:~$</span>
            <span class="prompt-cursor"></span>
        </div>
    </div>
</body>
