"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { getResume } from "@/lib/api";
import {
  adminAddExperience,
  adminRemoveExperience,
  adminReorderExperiences,
  adminUpdateExperience,
  adminUpdateResume,
} from "@/lib/adminApi";
import type { Link } from "@/lib/api";

interface ExperienceItem {
  id: number;
  companyName: string;
  description: string;
  startDate: string;
  endDate: string | null;
  displayOrder: number | null;
  expanded: boolean;
  saving: boolean;
}

interface InfoState {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  about: string;
}

const emptyNewExp = {
  companyName: "",
  description: "",
  startDate: "",
  endDate: "",
};

export default function ResumeAdminPage() {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoState>({ fullName: "", title: "", email: "", phone: "", about: "" });
  const [links, setLinks] = useState<Link[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [newExp, setNewExp] = useState(emptyNewExp);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingExp, setAddingExp] = useState(false);
  const [addExpError, setAddExpError] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    loadResume();
  }, []);

  async function loadResume() {
    try {
      const data = await getResume();
      setInfo({ fullName: data.fullName, title: data.title, email: data.email, phone: data.phone, about: data.about });
      setLinks(data.links.map((l) => ({ ...l })));
      setExperiences(
        (data.experiences as (typeof data.experiences[0] & { displayOrder?: number | null })[]).map((e, i) => ({
          id: e.id,
          companyName: e.companyName,
          description: e.description,
          startDate: e.startDate,
          endDate: e.endDate,
          displayOrder: e.displayOrder ?? i,
          expanded: false,
          saving: false,
        }))
      );
    } catch {
      setInfoError("Failed to load resume data.");
    } finally {
      setLoading(false);
    }
  }

  // ── Info & Links ────────────────────────────────────────────────────────────

  const handleInfoField = (field: keyof InfoState, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
    setInfoSuccess(false);
  };

  const handleLinkField = (index: number, field: keyof Link, value: string) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
    setInfoSuccess(false);
  };

  const addLink = () => {
    setLinks((prev) => [...prev, { label: "", url: "" }]);
    setInfoSuccess(false);
  };

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
    setInfoSuccess(false);
  };

  const handleSaveInfo = async () => {
    setSavingInfo(true);
    setInfoError(null);
    setInfoSuccess(false);
    try {
      await adminUpdateResume({ ...info, links });
      setInfoSuccess(true);
    } catch {
      setInfoError("Failed to save resume info. Please try again.");
    } finally {
      setSavingInfo(false);
    }
  };

  // ── Experiences ─────────────────────────────────────────────────────────────

  const toggleExpanded = (id: number) => {
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, expanded: !e.expanded } : e)));
  };

  const handleExpField = (
    id: number,
    field: keyof Pick<ExperienceItem, "companyName" | "description" | "startDate" | "endDate">,
    value: string
  ) => {
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const handleSaveExp = async (exp: ExperienceItem) => {
    setExperiences((prev) => prev.map((e) => (e.id === exp.id ? { ...e, saving: true } : e)));
    try {
      await adminUpdateExperience(exp.id, {
        companyName: exp.companyName,
        description: exp.description,
        startDate: exp.startDate,
        endDate: exp.endDate || null,
        displayOrder: exp.displayOrder,
      });
      setExperiences((prev) =>
        prev.map((e) => (e.id === exp.id ? { ...e, saving: false, expanded: false } : e))
      );
    } catch {
      setExperiences((prev) => prev.map((e) => (e.id === exp.id ? { ...e, saving: false } : e)));
      alert("Failed to save experience.");
    }
  };

  const handleDeleteExp = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await adminRemoveExperience(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete experience.");
    }
  };

  const handleAddExp = async () => {
    setAddingExp(true);
    setAddExpError(null);
    try {
      await adminAddExperience({
        companyName: newExp.companyName,
        description: newExp.description,
        startDate: newExp.startDate,
        endDate: newExp.endDate || null,
        displayOrder: experiences.length,
      });
      await loadResume();
      setNewExp(emptyNewExp);
      setShowAddForm(false);
    } catch {
      setAddExpError("Failed to add experience. Please try again.");
    } finally {
      setAddingExp(false);
    }
  };

  // ── Drag and Drop ────────────────────────────────────────────────────────────

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === index) return;
    setExperiences((prev) => {
      const reordered = [...prev];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(index, 0, moved);
      return reordered;
    });
    dragIndex.current = index;
  };

  const handleDrop = async () => {
    dragIndex.current = null;
    setReordering(true);
    try {
      const items = experiences.map((e, i) => ({ id: e.id, displayOrder: i }));
      await adminReorderExperiences(items);
      setExperiences((prev) => prev.map((e, i) => ({ ...e, displayOrder: i })));
    } catch {
      alert("Failed to save order. Please try again.");
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Resume</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Edit your CV data and reorder experiences.</p>

      {infoError && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {infoError}
        </div>
      )}
      {infoSuccess && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
          Saved successfully.
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Info</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                value={info.fullName}
                onChange={(e) => handleInfoField("fullName", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={info.title}
                onChange={(e) => handleInfoField("title", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={info.email}
                onChange={(e) => handleInfoField("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input
                type="text"
                value={info.phone}
                onChange={(e) => handleInfoField("phone", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About</label>
            <textarea
              value={info.about}
              onChange={(e) => handleInfoField("about", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
            />
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Links</h2>
          <button
            onClick={addLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            <Plus size={15} />
            Add
          </button>
        </div>
        {links.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500">No links yet. Click Add to create one.</p>
        )}
        <div className="space-y-3">
          {links.map((link, i) => (
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

      {/* Save Info + Links */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleSaveInfo}
          disabled={savingInfo}
          className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {savingInfo ? "Saving..." : "Save Info & Links"}
        </button>
      </div>

      {/* Experiences */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experiences</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Drag to reorder. Changes are saved automatically.</p>
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
          >
            <Plus size={15} />
            Add
          </button>
        </div>

        {reordering && (
          <div className="mb-3 text-xs text-gray-400 dark:text-gray-500">Saving order...</div>
        )}

        {experiences.length === 0 && !showAddForm && (
          <p className="text-sm text-gray-400 dark:text-gray-500">No experiences yet. Click Add to create one.</p>
        )}

        <div className="space-y-2">
          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={handleDrop}
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
            >
              {/* Row header */}
              <div className="flex items-center gap-2 px-3 py-3">
                <span className="cursor-grab text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 flex-shrink-0">
                  <GripVertical size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {exp.companyName || <span className="text-gray-400">Untitled</span>}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {exp.startDate} {exp.endDate ? `→ ${exp.endDate}` : "→ Present"}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteExp(exp.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                  aria-label="Delete experience"
                >
                  <Trash2 size={14} />
                </button>
                <button
                  onClick={() => toggleExpanded(exp.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                  aria-label={exp.expanded ? "Collapse" : "Expand"}
                >
                  {exp.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Expand form */}
              {exp.expanded && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={exp.companyName}
                      onChange={(e) => handleExpField(exp.id, "companyName", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => handleExpField(exp.id, "description", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                      <input
                        type="text"
                        placeholder="e.g. 2022-01"
                        value={exp.startDate}
                        onChange={(e) => handleExpField(exp.id, "startDate", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">End Date (leave blank for present)</label>
                      <input
                        type="text"
                        placeholder="e.g. 2024-06"
                        value={exp.endDate ?? ""}
                        onChange={(e) => handleExpField(exp.id, "endDate", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveExp(exp)}
                      disabled={exp.saving}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      {exp.saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add experience form */}
        {showAddForm && (
          <div className="mt-4 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">New Experience</h3>
            {addExpError && (
              <p className="text-xs text-red-600 dark:text-red-400">{addExpError}</p>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Company Name</label>
              <input
                type="text"
                value={newExp.companyName}
                onChange={(e) => setNewExp((p) => ({ ...p, companyName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
              <textarea
                value={newExp.description}
                onChange={(e) => setNewExp((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g. 2022-01"
                  value={newExp.startDate}
                  onChange={(e) => setNewExp((p) => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">End Date (leave blank for present)</label>
                <input
                  type="text"
                  placeholder="e.g. 2024-06"
                  value={newExp.endDate}
                  onChange={(e) => setNewExp((p) => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowAddForm(false); setNewExp(emptyNewExp); setAddExpError(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExp}
                disabled={addingExp}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {addingExp ? "Adding..." : "Add Experience"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
