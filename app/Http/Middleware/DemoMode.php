<?php

namespace App\Http\Middleware;

use Closure;
use Filament\Notifications\Notification;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DemoMode
{
    /**
     * Block all state-changing requests on the demo domain.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->getHost() !== 'demo.nlmanager.cc') {
            return $next($request);
        }

        if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            // Allow login / logout so the demo user can sign in
            $path = $request->path();
            $allowed = ['login', 'logout', 'livewire/update'];

            foreach ($allowed as $safe) {
                if (str_contains($path, $safe)) {
                    // For Livewire: allow render updates but block mutations
                    if ($safe === 'livewire/update') {
                        return $this->handleLivewire($request, $next);
                    }
                    return $next($request);
                }
            }

            if ($request->expectsJson() || $request->header('X-Livewire')) {
                return response()->json([
                    'message' => 'Демо режим — изменения заблокированы.',
                ], 403);
            }

            return redirect()->back()->with('demo_blocked', true);
        }

        return $next($request);
    }

    private function handleLivewire(Request $request, Closure $next): Response
    {
        $body = $request->input('components', []);

        // Read-only Livewire calls (renders, pagination, search) pass through
        foreach ($body as $component) {
            $calls = $component['calls'] ?? [];
            foreach ($calls as $call) {
                $method = $call['method'] ?? '';
                $blocked = ['save', 'create', 'delete', 'deleteSelected', 'forceDelete',
                    'restore', 'replicate', 'submit', 'callMountedAction', 'callMountedTableAction',
                    'callMountedTableBulkAction', 'callMountedFormComponentAction'];

                if (in_array($method, $blocked, true)) {
                    return response()->json([
                        'components' => [],
                        'assets' => [],
                        'xhrRedirect' => null,
                        '__dispatch' => [
                            ['name' => 'open-modal', 'params' => []],
                        ],
                    ]);
                }
            }
        }

        return $next($request);
    }
}
