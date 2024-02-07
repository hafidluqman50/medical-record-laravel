<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SetRoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::cursor();

        foreach ($users as $key => $value) {
            User::where('id', $value->id)->update(['role_id' => 1]);
        }
    }
}
