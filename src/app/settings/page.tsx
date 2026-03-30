"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAge } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";

const EMOJI_OPTIONS = ["🌸", "🌟", "🌈", "🍀", "🐰", "🦊", "🐻", "🎀"];
const COLOR_OPTIONS = ["#E8927C", "#7BAFD4", "#A8D5BA", "#F5C76B", "#C4A6E0", "#F9A8D4"];

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}

function SettingsContent() {
  const router = useRouter();
  const { user, users, isHost, logout, updateUserRole } = useAuth();
  const { children, addChild, updateChild, deleteChild, exportData, importData } = useData();
  const importRef = useRef<HTMLInputElement>(null);

  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);

  // Form state for editing/adding child
  const [formName, setFormName] = useState("");
  const [formBirthday, setFormBirthday] = useState("");
  const [formEmoji, setFormEmoji] = useState("🌸");
  const [formColor, setFormColor] = useState("#E8927C");

  const startEditChild = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (!child) return;
    setFormName(child.name);
    const bd = new Date(child.birthday);
    setFormBirthday(bd.toISOString().split("T")[0]);
    setFormEmoji(child.emoji);
    setFormColor(child.color);
    setEditingChildId(childId);
    setShowAddChild(false);
  };

  const startAddChild = () => {
    setFormName("");
    setFormBirthday("");
    setFormEmoji("🌸");
    setFormColor("#E8927C");
    setEditingChildId(null);
    setShowAddChild(true);
  };

  const handleSaveChild = () => {
    if (!formName.trim() || !formBirthday) {
      alert("おなまえ と たんじょうび を いれてね");
      return;
    }
    const data = {
      name: formName.trim(),
      birthday: new Date(formBirthday),
      emoji: formEmoji,
      color: formColor,
    };
    if (editingChildId) {
      updateChild(editingChildId, data);
      setEditingChildId(null);
    } else {
      addChild(data);
      setShowAddChild(false);
    }
  };

  const handleCancel = () => {
    setEditingChildId(null);
    setShowAddChild(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isEditing = editingChildId !== null || showAddChild;

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

              if (editingChildId === child.id) {
                return (
                  <ChildForm
                    key={child.id}
                    formName={formName}
                    setFormName={setFormName}
                    formBirthday={formBirthday}
                    setFormBirthday={setFormBirthday}
                    formEmoji={formEmoji}
                    setFormEmoji={setFormEmoji}
                    formColor={formColor}
                    setFormColor={setFormColor}
                    onSave={handleSaveChild}
                    onCancel={handleCancel}
                  />
                );
              }

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
                  {isHost && !isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditChild(child.id)}
                        className="px-3 py-1.5 text-xs font-medium text-terracotta border border-terracotta rounded-full hover:bg-terracotta/10 transition-colors"
                      >
                        へんしゅう
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`${child.name}を さくじょしますか？`)) {
                            deleteChild(child.id);
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-coral border border-coral rounded-full hover:bg-coral/10 transition-colors"
                      >
                        さくじょ
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {showAddChild && (
            <div className="mt-3">
              <ChildForm
                formName={formName}
                setFormName={setFormName}
                formBirthday={formBirthday}
                setFormBirthday={setFormBirthday}
                formEmoji={formEmoji}
                setFormEmoji={setFormEmoji}
                formColor={formColor}
                setFormColor={setFormColor}
                onSave={handleSaveChild}
                onCancel={handleCancel}
              />
            </div>
          )}

          {isHost && !isEditing && (
            <button
              onClick={startAddChild}
              className="w-full mt-3 py-3 border-2 border-dashed border-cocoa-light/40 rounded-xl text-sm font-medium text-cocoa-light hover:border-terracotta hover:text-terracotta transition-colors"
            >
              + こどもを ついか
            </button>
          )}
        </section>

        {/* User management - host only */}
        {isHost && (
          <section className="bg-sand rounded-2xl p-4 shadow-sm">
            <h2 className="text-base font-bold text-cocoa mb-3">
              ユーザーかんり
            </h2>
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between bg-white rounded-xl p-3"
                >
                  <div>
                    <p className="font-bold text-cocoa text-sm">
                      {u.displayName}
                      {u.id === user?.id && (
                        <span className="text-xs text-cocoa-light ml-1">
                          （じぶん）
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-cocoa-light">{u.email}</p>
                  </div>
                  <button
                    onClick={() =>
                      updateUserRole(
                        u.id,
                        u.role === "host" ? "viewer" : "host"
                      )
                    }
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      u.role === "host"
                        ? "text-terracotta border-terracotta bg-terracotta/10"
                        : "text-cocoa-light border-cocoa-light/40 hover:border-terracotta hover:text-terracotta"
                    }`}
                  >
                    {u.role === "host" ? "ホスト" : "けんらん"}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Account section */}
        <section className="bg-sand rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-cocoa mb-3">アカウント</h2>
          <div className="bg-white rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-cocoa-light">おなまえ</p>
                <p className="text-sm text-cocoa font-medium">
                  {user?.displayName}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  isHost
                    ? "bg-terracotta/10 text-terracotta"
                    : "bg-cocoa-light/10 text-cocoa-light"
                }`}
              >
                {isHost ? "ホスト" : "けんらん"}
              </span>
            </div>
            <div>
              <p className="text-xs text-cocoa-light">メールアドレス</p>
              <p className="text-sm text-cocoa font-medium">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 text-sm font-medium text-coral border border-coral rounded-full hover:bg-coral/10 transition-colors"
            >
              ログアウト
            </button>
          </div>
        </section>

        {/* Backup section */}
        <section className="bg-sand rounded-2xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-cocoa mb-3">
            バックアップ
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => {
                const json = exportData();
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `satou-sakuhin-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="w-full py-3 text-sm font-medium text-terracotta border border-terracotta rounded-full hover:bg-terracotta/10 transition-colors"
            >
              データを ダウンロード
            </button>
            <input
              ref={importRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                  try {
                    importData(ev.target?.result as string);
                    alert("データを ふっきゅう しました");
                  } catch {
                    alert("ファイルが ただしくありません");
                  }
                };
                reader.readAsText(file);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => importRef.current?.click()}
              className="w-full py-3 text-sm font-medium text-cocoa-light border border-cocoa-light/40 rounded-full hover:border-terracotta hover:text-terracotta transition-colors"
            >
              データを ふっきゅう
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

function ChildForm({
  formName,
  setFormName,
  formBirthday,
  setFormBirthday,
  formEmoji,
  setFormEmoji,
  formColor,
  setFormColor,
  onSave,
  onCancel,
}: {
  formName: string;
  setFormName: (v: string) => void;
  formBirthday: string;
  setFormBirthday: (v: string) => void;
  formEmoji: string;
  setFormEmoji: (v: string) => void;
  formColor: string;
  setFormColor: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="bg-white rounded-xl p-4 space-y-3 border-2 border-terracotta/30">
      <div>
        <label className="block text-xs font-medium text-cocoa mb-1">
          おなまえ
        </label>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="おなまえ"
          className="w-full px-3 py-2 bg-sand border border-cocoa-light/30 rounded-lg text-cocoa text-sm placeholder:text-cocoa-light/60 focus:outline-none focus:ring-2 focus:ring-terracotta/50"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-cocoa mb-1">
          たんじょうび
        </label>
        <input
          type="date"
          value={formBirthday}
          onChange={(e) => setFormBirthday(e.target.value)}
          className="w-full px-3 py-2 bg-sand border border-cocoa-light/30 rounded-lg text-cocoa text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/50"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-cocoa mb-1">
          アイコン
        </label>
        <div className="flex gap-2 flex-wrap">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setFormEmoji(e)}
              className={`text-2xl p-1 rounded-lg transition-all ${
                formEmoji === e
                  ? "bg-terracotta/10 ring-2 ring-terracotta"
                  : "hover:bg-sand"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-cocoa mb-1">
          テーマカラー
        </label>
        <div className="flex gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFormColor(c)}
              className={`w-8 h-8 rounded-full transition-all ${
                formColor === c ? "ring-2 ring-offset-2 ring-terracotta" : ""
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 text-sm font-medium text-cocoa-light border border-cocoa-light/40 rounded-full hover:bg-sand transition-colors"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex-1 py-2 text-sm font-medium text-white bg-terracotta rounded-full hover:opacity-90 transition-opacity"
        >
          ほぞん
        </button>
      </div>
    </div>
  );
}
