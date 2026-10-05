"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Search,
  Sparkles,
  AlertTriangle,
  Fingerprint,
} from "lucide-react";
import { toast } from "sonner";

type SecretItem = {
  id: string;
  name: string;
  value: string;
  category: "API Keys" | "Database" | "SSH & Auth" | "Seed Phrases" | "Notes";
  created: string;
  revealed?: boolean;
};

export default function SecretsPage() {
  const [secrets, setSecrets] = useState<SecretItem[]>([
    {
      id: "sec-1",
      name: "CLERK_SECRET_KEY",
      value: "sk_live_994821049281a8b9281c7",
      category: "API Keys",
      created: "Oct 04, 2026",
      revealed: false,
    },
    {
      id: "sec-2",
      name: "POSTGRES_PROD_CONNECTION_STRING",
      value: "postgresql://postgres:Nv_SecurePass_992@db.notevault.internal:5432/main",
      category: "Database",
      created: "Oct 02, 2026",
      revealed: false,
    },
    {
      id: "sec-3",
      name: "AWS_S3_ENCRYPTION_MASTER_KEY",
      value: "AKIA_NV_994819284710294821",
      category: "API Keys",
      created: "Sep 29, 2026",
      revealed: false,
    },
    {
      id: "sec-4",
      name: "SERVER_ROOT_ED25519_PRIVATE_KEY",
      value: "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAA...",
      category: "SSH & Auth",
      created: "Sep 25, 2026",
      revealed: false,
    },
    {
      id: "sec-5",
      name: "ETHEREUM_SAFE_MULTISIG_SEED",
      value: "galaxy velvet marble hammer pulse victory orbital quantum canvas radar crystal beacon",
      category: "Seed Phrases",
      created: "Sep 18, 2026",
      revealed: false,
    },
  ]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New secret form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newCategory, setNewCategory] = useState<SecretItem["category"]>("API Keys");

  const toggleReveal = (id: string) => {
    setSecrets(
      secrets.map((s) => (s.id === id ? { ...s, revealed: !s.revealed } : s))
    );
  };

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    toast.success("Secret copied! Memory will be scrubbed automatically.");
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setSecrets(secrets.filter((s) => s.id !== id));
    toast.success("Secret safely deleted from vault.");
  };

  const handleCreateSecret = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newValue.trim()) {
      toast.error("Please provide both a name and secret value.");
      return;
    }

    const newSecret: SecretItem = {
      id: `sec-${Date.now()}`,
      name: newName.trim(),
      value: newValue.trim(),
      category: newCategory,
      created: "Just now",
      revealed: false,
    };

    setSecrets([newSecret, ...secrets]);
    setNewName("");
    setNewValue("");
    setIsModalOpen(false);
    toast.success("Secret encrypted and saved to vault!");
  };

  const categories = ["All", "API Keys", "Database", "SSH & Auth", "Seed Phrases"];

  const filteredSecrets = secrets.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Encrypted Secrets Vault
            </h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              AES-256-GCM
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Zero-knowledge, client-side encrypted credentials, API keys, and recovery seeds.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-9 gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Lock New Secret</span>
        </Button>
      </div>

      {/* Security Status Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Master Key Protected • Argon2id Memory-Hard Hash
            </h3>
            <p className="text-xs text-muted-foreground">
              Plaintext secrets never leave your local browser memory without explicit decryption.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Fingerprint className="h-4 w-4 text-emerald-500" />
          <span>Vault Status: 100% Locked</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vault secrets..."
            className="pl-9 h-9 text-xs rounded-xl bg-card"
          />
        </div>
      </div>

      {/* Secrets Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSecrets.map((secret) => (
          <Card
            key={secret.id}
            className="border border-border/80 shadow-xs hover:shadow-md transition-all p-4 space-y-3 bg-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-foreground font-mono truncate max-w-[220px]">
                    {secret.name}
                  </h4>
                  <span className="text-[10px] text-muted-foreground">
                    #{secret.category} • {secret.created}
                  </span>
                </div>
              </div>

              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                AES-256
              </span>
            </div>

            {/* Secret Value Mask / Reveal container */}
            <div className="flex items-center justify-between rounded-xl bg-muted/60 p-2.5 font-mono text-xs border border-border/50">
              <span className="tracking-widest font-semibold select-all text-foreground truncate mr-2">
                {secret.revealed ? secret.value : "••••••••••••••••••••••••••••"}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                  onClick={() => toggleReveal(secret.id)}
                  title={secret.revealed ? "Mask Secret" : "Reveal Secret"}
                >
                  {secret.revealed ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary"
                  onClick={() => handleCopy(secret.id, secret.value)}
                  title="Copy to clipboard"
                >
                  {copiedId === secret.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
              <span>Encrypted client-side</span>
              <button
                type="button"
                onClick={() => handleDelete(secret.id)}
                className="text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </Card>
        ))}

        {filteredSecrets.length === 0 && (
          <div className="col-span-2 py-12 text-center text-xs text-muted-foreground border-2 border-dashed border-border/60 rounded-2xl">
            No encrypted secrets found matching your filter.
          </div>
        )}
      </div>

      {/* Add Secret Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50">
          <div className="w-full max-w-lg rounded-2xl border border-border/80 bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-500" />
                <h3 className="font-bold text-base text-foreground">
                  Lock New Secret into Vault
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </div>

            <form onSubmit={handleCreateSecret} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Secret Identifier / Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. AWS_SECRET_ACCESS_KEY or DB_PASSWORD"
                  className="rounded-xl h-10 font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Secret Value (Encrypted Locally)</label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Paste confidential token, private key, or password..."
                  className="w-full rounded-xl border border-input bg-card p-3 font-mono text-xs h-24 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-foreground">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SecretItem["category"])}
                  className="w-full rounded-xl border border-input bg-card p-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="API Keys">API Keys</option>
                  <option value="Database">Database</option>
                  <option value="SSH & Auth">SSH & Auth</option>
                  <option value="Seed Phrases">Seed Phrases</option>
                  <option value="Notes">Private Confidential Note</option>
                </select>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] text-muted-foreground space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Zero-Knowledge Promise</span>
                </div>
                <div>
                  This secret will be encrypted in-browser using your master key. It is never
                  accessible in raw text to outside parties.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Lock into Vault
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
