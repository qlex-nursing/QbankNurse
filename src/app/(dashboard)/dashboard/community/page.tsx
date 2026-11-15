"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  MessageCircle,
  Users,
  Send,
  Plus,
  Search,
  Sparkles,
  MessagesSquare,
} from "lucide-react";

import {
  communityCategories,
  initialCommunityPosts,
  type CommunityCategory,
  type CommunityPost,
} from "@/data/mock/dashboard/community";

const STORAGE_KEY = "qbanknurse-community-posts";

type CategoryFilter = "All" | CommunityCategory;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(
    initialCommunityPosts,
  );

  const [storageReady, setStorageReady] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");

  const [composerCategory, setComposerCategory] =
    useState<CommunityCategory>("Question");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");

  const [expandedPost, setExpandedPost] = useState<string | null>(
    null,
  );

  const [replyText, setReplyText] = useState<
    Record<string, string>
  >({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load locally saved discussions.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setPosts(parsed);
        }
      }
    } catch {
      setPosts(initialCommunityPosts);
    }

    setStorageReady(true);
  }, []);

  // Save discussions in this browser.
  useEffect(() => {
    if (!storageReady) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts, storageReady]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts
      .filter((post) => {
        const matchesCategory =
          selectedCategory === "All" ||
          post.category === selectedCategory;

        const matchesSearch =
          !query ||
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      );
  }, [posts, selectedCategory, search]);

  const totalReplies = posts.reduce(
    (total, post) => total + post.replies.length,
    0,
  );

  const createPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      setError("Please complete both the title and description.");
      setSuccess("");
      return;
    }

    if (cleanTitle.length < 5 || cleanContent.length < 10) {
      setError("Please provide a more descriptive post.");
      setSuccess("");
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      category: composerCategory,
      author: "QbankNurse Student",
      title: cleanTitle,
      content: cleanContent,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setPosts((current) => [newPost, ...current]);

    setTitle("");
    setContent("");
    setSelectedCategory("All");
    setSearch("");
    setError("");
    setSuccess("Your discussion has been published!");
    
    window.setTimeout(() => setSuccess(""), 3000);
  };

  const addReply = (
    event: FormEvent<HTMLFormElement>,
    postId: string,
  ) => {
    event.preventDefault();

    const cleanReply = (replyText[postId] ?? "").trim();

    if (!cleanReply) return;

    const reply = {
      id: `reply-${Date.now()}`,
      author: "QbankNurse Student",
      content: cleanReply,
      createdAt: new Date().toISOString(),
    };

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? { ...post, replies: [...post.replies, reply] }
          : post,
      ),
    );

    setReplyText((current) => ({
      ...current,
      [postId]: "",
    }));
  };

  return (
    <div className="dashboard-content space-y-8">

      {/* STUDENT COMMUNITY HEADER */}
      <section className="relative overflow-hidden rounded-3xl border p-6 md:p-9"
        style={{
          background:
            "linear-gradient(120deg, var(--dash-surface), var(--dash-surface-soft))",
          borderColor: "var(--dash-border)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "#8B72FF" }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
            style={{
              background: "var(--dash-secondary)",
              borderColor: "var(--dash-border)",
              color: "var(--dash-primary)",
            }}
          >
            <Sparkles size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">
              QbankNurse Community
            </span>
          </div>

          <h1 className="dashboard-heading text-3xl font-extrabold tracking-tight md:text-4xl">
            Student Community
          </h1>

          <p className="dashboard-body mt-3 max-w-2xl text-sm leading-7 md:text-base">
            Nursing school is better when we learn together. Ask
            questions, exchange study tips, share experiences and
            support fellow nursing students.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
            >
              <Users size={17} style={{ color: "var(--dash-primary)" }} />
              <span className="dashboard-body text-sm font-medium">
                Learn together
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl px-4 py-2.5"
              style={{
                background: "var(--dash-surface)",
                border: "1px solid var(--dash-border)",
              }}
            >
              <MessageCircle
                size={17}
                style={{ color: "var(--dash-primary)" }}
              />
              <span className="dashboard-body text-sm font-medium">
                Share knowledge
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY STATS */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="dashboard-card flex items-center gap-4 rounded-2xl p-5">
          <div className="dashboard-soft-icon flex h-12 w-12 items-center justify-center rounded-xl">
            <MessagesSquare size={22} />
          </div>

          <div>
            <p className="dashboard-muted text-sm">Discussions</p>
            <h2 className="dashboard-heading mt-1 text-2xl font-bold">
              {posts.length}
            </h2>
          </div>
        </div>

        <div className="dashboard-card flex items-center gap-4 rounded-2xl p-5">
          <div className="dashboard-soft-icon flex h-12 w-12 items-center justify-center rounded-xl">
            <MessageCircle size={22} />
          </div>

          <div>
            <p className="dashboard-muted text-sm">Replies</p>
            <h2 className="dashboard-heading mt-1 text-2xl font-bold">
              {totalReplies}
            </h2>
          </div>
        </div>
      </section>

      {/* CREATE DISCUSSION */}
      <section className="dashboard-card rounded-2xl p-5 md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="dashboard-soft-icon flex h-11 w-11 items-center justify-center rounded-xl">
            <Plus size={21} />
          </div>

          <div>
            <h2 className="dashboard-heading text-lg font-bold">
              Start a discussion
            </h2>
            <p className="dashboard-muted mt-1 text-sm">
              What's on your mind? Share it with other students.
            </p>
          </div>
        </div>

        <form onSubmit={createPost} className="space-y-4">

          {/* CATEGORY SELECTOR */}
          <div>
            <p className="dashboard-muted mb-3 text-xs font-semibold uppercase tracking-wider">
              Choose a category
            </p>

            <div className="flex flex-wrap gap-2">
              {communityCategories.map((category) => {
                const active = composerCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setComposerCategory(category)}
                    className="rounded-full border px-4 py-2 text-xs font-semibold transition"
                    style={{
                      background: active
                        ? "var(--dash-primary)"
                        : "var(--dash-surface)",
                      color: active
                        ? "var(--dash-primary-text)"
                        : "var(--dash-body)",
                      borderColor: active
                        ? "var(--dash-primary)"
                        : "var(--dash-border)",
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            placeholder="Discussion title..."
            className="dashboard-search w-full rounded-xl px-4 py-3 text-sm"
          />

          <div>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={2000}
              rows={5}
              placeholder="Share details, ask a question or tell us what you've learned..."
              className="dashboard-search w-full resize-y rounded-xl px-4 py-3 text-sm leading-6"
            />

            <p className="dashboard-muted mt-1 text-right text-xs">
              {content.length}/2000
            </p>
          </div>

          {error && (
            <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="dashboard-primary-button flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
            >
              <Send size={16} />
              Publish post
            </button>
          </div>
        </form>
      </section>

      {/* DISCUSSION FEED */}
      <section className="space-y-5">

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="dashboard-heading text-xl font-bold">
              Latest discussions
            </h2>
            <p className="dashboard-muted mt-1 text-sm">
              Explore conversations from the nursing community.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search
              size={17}
              className="dashboard-muted absolute left-3 top-1/2 -translate-y-1/2"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search discussions..."
              className="dashboard-search w-full rounded-xl py-3 pl-10 pr-4 text-sm"
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2">
          {(["All", ...communityCategories] as const).map(
            (category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full border px-4 py-2 text-xs font-semibold transition"
                  style={{
                    background: active
                      ? "var(--dash-primary)"
                      : "var(--dash-surface)",
                    color: active
                      ? "var(--dash-primary-text)"
                      : "var(--dash-body)",
                    borderColor: active
                      ? "var(--dash-primary)"
                      : "var(--dash-border)",
                  }}
                >
                  {category}
                </button>
              );
            },
          )}
        </div>

        {/* POSTS */}
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const expanded = expandedPost === post.id;

            return (
              <article
                key={post.id}
                className="dashboard-card rounded-2xl p-5 md:p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{
                      background: "var(--dash-secondary)",
                      color: "var(--dash-primary)",
                    }}
                  >
                    {post.category}
                  </span>

                  <span className="dashboard-muted text-xs">
                    {post.author}
                  </span>

                  <span className="dashboard-muted text-xs">·</span>

                  <span className="dashboard-muted text-xs">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                <h3 className="dashboard-heading mt-4 text-lg font-bold">
                  {post.title}
                </h3>

                <p className="dashboard-body mt-2 whitespace-pre-wrap text-sm leading-7">
                  {post.content}
                </p>

                <div className="dashboard-divider mt-5 flex items-center justify-between border-t pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPost(expanded ? null : post.id)
                    }
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: "var(--dash-primary)" }}
                  >
                    <MessageCircle size={17} />
                    {post.replies.length}{" "}
                    {post.replies.length === 1 ? "reply" : "replies"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPost(expanded ? null : post.id)
                    }
                    className="dashboard-muted text-sm font-medium hover:underline"
                  >
                    {expanded ? "Hide replies" : "Join discussion"}
                  </button>
                </div>

                {expanded && (
                  <div className="mt-5 space-y-4">

                    {post.replies.length > 0 ? (
                      post.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="dashboard-inner-card rounded-xl p-4"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="dashboard-heading text-sm font-semibold">
                              {reply.author}
                            </span>

                            <span className="dashboard-muted text-xs">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>

                          <p className="dashboard-body mt-2 text-sm leading-6">
                            {reply.content}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="dashboard-muted text-sm">
                        No replies yet. Be the first to respond.
                      </p>
                    )}

                    <form
                      onSubmit={(event) => addReply(event, post.id)}
                      className="flex flex-col gap-2 sm:flex-row"
                    >
                      <input
                        type="text"
                        value={replyText[post.id] ?? ""}
                        onChange={(event) =>
                          setReplyText((current) => ({
                            ...current,
                            [post.id]: event.target.value,
                          }))
                        }
                        maxLength={1000}
                        placeholder="Write your reply..."
                        className="dashboard-search min-w-0 flex-1 rounded-xl px-4 py-3 text-sm"
                      />

                      <button
                        type="submit"
                        disabled={!(replyText[post.id] ?? "").trim()}
                        className="dashboard-primary-button flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send size={15} />
                        Reply
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="dashboard-card rounded-2xl px-5 py-14 text-center">
              <div className="dashboard-soft-icon mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
                <MessageCircle size={25} />
              </div>

              <h3 className="dashboard-heading mt-4 font-bold">
                No discussions found
              </h3>

              <p className="dashboard-muted mt-2 text-sm">
                Try another category or search for something else.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearch("");
                }}
                className="mt-4 text-sm font-semibold"
                style={{ color: "var(--dash-primary)" }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* DEMO NOTICE */}
      <div className="dashboard-inner-card rounded-xl p-4">
        <p className="dashboard-muted text-xs leading-6">
          Community preview: discussions and replies are stored
          locally in this browser. Shared discussions, registered
          student accounts and backend integration will be added
          later.
        </p>
      </div>
    </div>
  );
}