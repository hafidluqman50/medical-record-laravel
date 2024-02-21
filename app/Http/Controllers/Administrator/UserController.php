<?php

namespace App\Http\Controllers\Administrator;

use App\Models\Role;
use App\Models\User;
use App\Http\Controllers\Controller;
use DB;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->search;

        $users = User::with(['role'])->when($request->filled('search'), function(Builder $query) use ($search) {
            $query->where('name','like',"%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhereHas('role', function(Builder $queryRole) use ($search) {
                        $queryRole->where('name', 'like', "%{$search}%");
                  });
            })->orderByDesc('id')->paginate(5)->onEachSide(3)->withQueryString();

        $page_num = ($users->currentPage() - 1) * $users->perPage() + 1;

        return Inertia::render('Administrator/User/Index', compact('users', 'page_num'));
    }

    public function create(): Response
    {
        $roles = Role::all();

        return Inertia::render('Administrator/User/Create', compact('roles'));
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'username' => 'required|string|unique:'.User::class,
            'password' => ['required', Rules\Password::defaults()],
            'role_id'  => 'required|integer|exists:'.Role::class.',id'
        ]);

        DB::beginTransaction();

        try {
            $input = $request->all();
            $input['status_user'] = 1;

            User::create($input);
            DB::commit();

            return redirect()->intended('/administrator/users')->with('success', 'Berhasil Input User!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }

    public function edit(int $id): Response
    {
        $roles = Role::all();

        $user = User::where('id',$id)->firstOrFail();

        return Inertia::render('Administrator/User/Edit', compact('user', 'roles'));
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'username' => 'required|string|unique:'.User::class.',username,'.$id,
            'role_id'  => 'required|integer|exists:'.Role::class.',id',
            'password' => ['sometimes', 'nullable', Rules\Password::defaults()],
        ]);

        DB::beginTransaction();

        try {
            
            if(!$request->filled('password')) {
                $input = $request->except('password');
            } else {
                $input = $request->all();
            }

            User::where('id', $id)->update($input);
            DB::commit();

            return redirect()->intended('/administrator/users')->with('success', 'Berhasil Update User!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }

    public function updateStatus(int $id): RedirectResponse
    {
        $user = User::where('id',$id)->firstOrFail();

        if ($user->status_user == 1) {
            User::where('id',$id)->update(['status_user' => 0]);
            $message = 'Berhasil Non Aktifkan User!';
        }
        else {
            User::where('id',$id)->update(['status_user' => 1]);
            $message = 'Berhasil Aktifkan User!';
        }

        return redirect()->intended('/administrator/users')->with('success', $message);
    }

    public function delete(int $id): RedirectResponse
    {
        DB::beginTransaction();

        try {

            User::where('id', $id)->delete();
            DB::commit();

            return redirect()->intended('/administrator/users')->with('success', 'Berhasil Hapus User!');
        } catch (Exception $e) {
            DB::rollBack();

            throw new Exception($e->getMessage().' - Line: '.$e->getLine());
        }
    }
}
