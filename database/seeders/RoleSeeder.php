<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Administrator', 'slug_name' => Str::slug('Administrator', '-')],
            ['name' => 'Kasir', 'slug_name' => Str::slug('Kasir', '-')],
            ['name' => 'Gudang', 'slug_name' => Str::slug('Gudang', '-')],
        ];

        foreach($roles as $key => $value) {
            Role::create($value);
        }
    }
}
