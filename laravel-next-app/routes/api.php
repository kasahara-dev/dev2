<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// 商品一覧API（変更なし）
Route::get("/products", [ProductController::class, "index"]);

// 認証済みユーザーのみアクセス可能なルート
Route::middleware("auth:sanctum")->get("/user", function (Request $request) {
    return $request->user();
});
