<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            SystemConfigSeeder::class,
            RoleSeeder::class
        ]);

        $role = Role::where('slug', 'admin')->firstOrFail();

        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@admin.id',
            'username' => 'administrator',
            'password' => Hash::make('TernakIncome2025System'),
            'role_id' => $role->id,
            'provider' => 'none',
            'bio' => 'Administrator',

        ]);
    }
}
