<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\SystemConfig;

class SystemConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if the system_config table is empty
        if (SystemConfig::count() === 0) {
            // Create a new SystemConfig record with default values
            SystemConfig::create([
                'default_user_password' => 'User123_',
            ]);
        }
    }
}
