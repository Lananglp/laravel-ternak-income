<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Models\SystemConfig;

class SystemConfigController extends Controller
{
    public function edit(Request $request): Response
    {
        $systemConfig = SystemConfig::first();
        if (!$systemConfig) {
            $systemConfig = new SystemConfig();
            $systemConfig->save();
        }

        return Inertia::render('settings/system', [
            'systemConfig' => $systemConfig,
        ]);
    }

    public function update(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'default_user_password' => 'required|string|max:255',
        ]);

        $systemConfig = SystemConfig::first();
        if (!$systemConfig) {
            $systemConfig = new SystemConfig();
        }

        $systemConfig->default_user_password = $request->input('default_user_password');
        $systemConfig->save();

        return redirect()->back()->with('success', 'System configuration updated successfully.');
    }
}
