"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { getAbout } from "@/lib/api";
import { adminUpdateAbout } from "@/lib/adminApi";
import type { Technology, Link } from "@/lib/api";

interface FormState {
  name: string;
  title: string;
  description: string;
  aboutText: string;
  technologies: Technology[];
  links: Link[];
}

const emptyForm: FormState = {
  name: "",
  title: "",
  description: "",
  aboutText: "",
  technologies: [],
  links: [],
};

export default function AboutAdminPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const techDragIndex = useRef<number | null>(null);

  useEffect(() => {
    getAbout()
      .then((data) => {
        setForm({
          name: data.name,
          title: data.title,
          description: data.description,
          aboutText: data.aboutText,
          technologies: data.technologies.map((t) => ({ ...t })),
          links: data.links.map((l) => ({ ...l })),
        });
      })
      .catch(() => toast.error("Failed to load About data."))
      .finally(() => setLoading(false));
  }, []);

  const handleField = (field: keyof Pick<FormState, "name" | "title" | "description" | "aboutText">, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Technologies
  const handleTechField = (index: number, field: keyof Technology, value: string) => {
    setForm((prev) => {
      const technologies = prev.technologies.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      );
      return { ...prev, technologies };
    });
  };

  const addTechnology = () => {
    setForm((prev) => ({
      ...prev,
      technologies: [...prev.technologies, { name: "", imageUrl: "" }],
    }));
  };

  const removeTechnology = (index: number) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const handleTechDragStart = (index: number) => {
    techDragIndex.current = index;
  };

  const handleTechDragOver = (e: React.DragEvent, overIndex: number) => {
    e.preventDefault();
    const from = techDragIndex.current;
    if (from === null || from === overIndex) return;
    setForm((prev) => {
      const technologies = [...prev.technologies];
      const [moved] = technologies.splice(from, 1);
      technologies.splice(overIndex, 0, moved);
      return { ...prev, technologies };
    });
    techDragIndex.current = overIndex;
  };

  const handleTechDrop = () => {
    techDragIndex.current = null;
  };

  // Links
  const handleLinkField = (index: number, field: keyof Link, value: string) => {
    setForm((prev) => {
      const links = prev.links.map((l, i) =>
        i === index ? { ...l, [field]: value } : l
      );
      return { ...prev, links };
    });
  };

  const addLink = () => {
    setForm((prev) => ({
      ...prev,
      links: [...prev.links, { label: "", url: "" }],
    }));
  };

  const removeLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminUpdateAbout(form);
      toast.success("About saved successfully");
    } catch {
      toast.error("Failed to save about. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-gray-500 dark:text-gray-400">Loading...</div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">About</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Edit your bio, tech stack, and social links.</p>

      {/* Bio */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bio</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleField("name", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleField("title", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleField("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Text</label>
            <textarea
              value={form.aboutText}
              onChange={(e) => handleField("aboutText", e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
            />
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Technologies</h2>
          <button
            onClick={addTechnology}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
        {form.technologies.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500">No technologies yet. Click Add to create one.</p>
        )}
        <div className="space-y-3">
          {form.technologies.map((tech, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => handleTechDragStart(i)}
              onDragOver={(e) => handleTechDragOver(e, i)}
              onDrop={handleTechDrop}
              className="flex gap-3 items-start cursor-grab active:cursor-grabbing"
            >
              <div className="pt-2.5 text-gray-400 dark:text-gray-500 shrink-0">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={tech.name}
                  onChange={(e) => handleTechField(i, "name", e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={tech.imageUrl}
                  onChange={(e) => handleTechField(i, "imageUrl", e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={() => removeTechnology(i)}
                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                aria-label="Remove technology"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h2>
          <button
            onClick={addLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
        {form.links.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500">No links yet. Click Add to create one.</p>
        )}
        <div className="space-y-3">
          {form.links.map((link, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => handleLinkField(i, "label", e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handleLinkField(i, "url", e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={() => removeLink(i)}
                className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                aria-label="Remove link"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
