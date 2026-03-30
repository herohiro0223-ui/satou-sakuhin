"use client";

import { children } from "@/data/mock";
import { getAge } from "@/lib/utils";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";

export default function SettingsPage() {
  const handleEditChild = (childId: string) => {
    alert("編集機能は準備中です");
  };

  const handleAddChild = () => {
    alert("追加機能は準備中です");
  };

  const handleLogout = () => {
    alert("ログアウト機能は準備中です");
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="pt-14 pb-20 px-4 space-y-4 py-4">
        {/* Children section */}
        <section className="bg-sand rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-cocoa mb-3">
            こどもの じょうほう
          </h2>
          <div className="space-y-3">
            {children.map((child) => {
              const birthday = new Date(child.birthday);
              const age = getAge(birthday);
              const formattedBirthday = `${birthday.getFullYear()}年${birthday.getMonth() + 1}月${birthday.getDate()}日`;

              return (
                <div
                  key={child.id}
                  className="flex items-center justify-between bg-white rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{child.emoji}</span>
                    <div>
                      <p className="font-bold text-cocoa">{child.name}</p>
                      <p className="text-xs text-cocoa-light">
                        {formattedBirthday}（{age}さい）
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditChild(child.id)}
                    className="px-3 py-1.5 text-xs font-medium text-terracotta border border-terracotta rounded-full hover:bg-terracotta/10 transition-colors"
                  >
                    へんしゅう
                  </button>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleAddChild}
            className="w-full mt-3 py-3 border-2 border-dashed border-cocoa-light/40 rounded-xl text-sm font-medium text-cocoa-light hover:border-terracotta hover:text-terracotta transition-colors"
          >
            + こどもを ついか
          </button>
        </section>

        {/* Account section */}
        <section className="bg-sand rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-cocoa mb-3">アカウント</h2>
          <div className="bg-white rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-cocoa-light">メールアドレス</p>
                <p className="text-sm text-cocoa font-medium">
                  family@example.com
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 text-sm font-medium text-coral border border-coral rounded-full hover:bg-coral/10 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </section>

        {/* About section */}
        <section className="bg-sand rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-cocoa mb-3">
            このアプリについて
          </h2>
          <div className="bg-white rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cocoa-light">バージョン</span>
              <span className="text-sm text-cocoa font-medium">1.0.0</span>
            </div>
            <div className="pt-2 border-t border-cocoa-light/20">
              <p className="text-xs text-cocoa-light text-center">
                Made with love for our little artists
              </p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
