import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as Tooltip from "@radix-ui/react-tooltip";
import { addEmails } from "../../services/emailService";
import { getRoles } from "../../services/roleService";

interface Props {
  closeModal: () => void;
  refreshEmails: () => void;
}

// ── Reusable Tooltip wrapper ──────────────────────────────────────────────────
function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip.Root delayDuration={300}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          sideOffset={6}
          className="
            z-[9999] px-2.5 py-1.5 rounded-lg
            bg-gray-900 text-white text-[11px] font-medium
            shadow-lg select-none
            animate-in fade-in-0 zoom-in-95
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          "
        >
          {label}
          <Tooltip.Arrow className="fill-gray-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AddEmailModal({ closeModal, refreshEmails }: Props) {
  const [emailInput, setEmailInput] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { fetchRoles(); }, []);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles", { description: "Please refresh and try again." });
    }
  };

  const toggleRole = (id: number) => {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const removeRole = (id: number) => {
    setSelectedRoleIds((prev) => prev.filter((r) => r !== id));
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addEmail = (raw: string) => {
    const trimmed = raw.trim().replace(/,+$/, "");
    if (!trimmed) return;
    if (!isValidEmail(trimmed)) {
      toast.error("Invalid email address", { description: `"${trimmed}" is not a valid email.` });
      return;
    }
    if (emailList.includes(trimmed)) {
      toast.warning("Already added", { description: `${trimmed} is already in the list.` });
      setEmailInput("");
      return;
    }
    setEmailList((prev) => [...prev, trimmed]);
    setEmailInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail(emailInput);
    }
    if (e.key === "Backspace" && emailInput === "" && emailList.length > 0) {
      const removed = emailList[emailList.length - 1];
      setEmailList((prev) => prev.slice(0, -1));
      toast.info("Email removed", { description: removed });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(",")) {
      addEmail(val);
    } else {
      setEmailInput(val);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const parts = pasted.split(/[\s,;]+/).filter(Boolean);
    const invalid: string[] = [];
    const newEmails: string[] = [];
    parts.forEach((p) => {
      const t = p.trim();
      if (!t) return;
      if (!isValidEmail(t)) { invalid.push(t); return; }
      if (!emailList.includes(t) && !newEmails.includes(t)) newEmails.push(t);
    });
    if (newEmails.length) {
      setEmailList((prev) => [...prev, ...newEmails]);
      toast.success(`${newEmails.length} email${newEmails.length > 1 ? "s" : ""} pasted`, {
        description: newEmails.join(", "),
      });
    }
    if (invalid.length)
      toast.warning("Some emails skipped", { description: `Invalid: ${invalid.join(", ")}` });
  };

  const removeEmail = (email: string) => {
    setEmailList((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = async () => {
    const finalList = [...emailList];

    if (emailInput.trim()) {
      const t = emailInput.trim();
      if (!isValidEmail(t)) {
        toast.error("Invalid email address", { description: `"${t}" is not a valid email.` });
        return;
      }
      if (!finalList.includes(t)) finalList.push(t);
      setEmailList(finalList);
      setEmailInput("");
    }

    if (finalList.length === 0) {
      toast.error("No emails added", { description: "Add at least one email address." });
      return;
    }
    if (selectedRoleIds.length === 0) {
      toast.error("No role selected", { description: "Select at least one role." });
      return;
    }

    const toastId = toast.loading(
      `Saving ${finalList.length} email${finalList.length > 1 ? "s" : ""}...`
    );

    try {
      setLoading(true);
      await Promise.all(
        selectedRoleIds.map((roleId) =>
          addEmails({ emails: finalList.join(","), roleId: Number(roleId) })
        )
      );
      toast.success("Emails added successfully!", {
        id: toastId,
        description: `${finalList.length} email${finalList.length > 1 ? "s" : ""} assigned to ${selectedRoleIds.length} role${selectedRoleIds.length > 1 ? "s" : ""}.`,
        duration: 4000,
      });
      refreshEmails();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add emails", {
        id: toastId,
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = emailList.length > 0 || emailInput.trim().length > 0;

  return (
    <Tooltip.Provider>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Add Emails</h2>
                <p className="text-xs text-gray-400">Add one or multiple email addresses</p>
              </div>
            </div>
            <Tip label="Close modal">
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Tip>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">

            {/* Email chip input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-600">Email Address</label>
                {emailList.length > 0 && (
                  <Tip label={`${emailList.length} email${emailList.length > 1 ? "s" : ""} queued for saving`}>
                    <span className="text-xs text-blue-500 font-medium cursor-default">
                      {emailList.length} added
                    </span>
                  </Tip>
                )}
              </div>

              <div
                onClick={() => inputRef.current?.focus()}
                className="min-h-[44px] w-full px-3 py-2 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 cursor-text flex flex-wrap gap-1.5"
              >
                {emailList.map((email) => (
                  <Tip key={email} label="Click × to remove">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100 max-w-full">
                      <span className="truncate max-w-[200px]">{email}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeEmail(email); }}
                        className="text-blue-400 hover:text-blue-700 transition-colors flex-shrink-0 ml-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  </Tip>
                ))}

                <input
                  ref={inputRef}
                  type="text"
                  value={emailInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  onBlur={() => { if (emailInput.trim()) addEmail(emailInput); }}
                  placeholder={emailList.length === 0 ? "type email and press Enter or ," : "add more..."}
                  className="flex-1 min-w-[140px] text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent py-0.5"
                />
              </div>

              <p className="text-[11px] text-gray-400 mt-1.5">
                Press{" "}
                <Tip label="Confirms and adds the email as a chip">
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[10px] cursor-default">Enter</kbd>
                </Tip>
                {" "}or{" "}
                <Tip label="Comma also confirms the email">
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[10px] cursor-default">,</kbd>
                </Tip>
                {" "}to add ·{" "}
                <Tip label="Paste a comma or space separated list to bulk-add">
                  <span className="underline decoration-dotted cursor-default">paste a list</span>
                </Tip>
                {" "}·{" "}
                <Tip label="Backspace on empty input removes the last chip">
                  <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500 font-mono text-[10px] cursor-default">⌫</kbd>
                </Tip>
                {" "}to undo last
              </p>
            </div>

            {/* Multi-role select */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-600">Roles</label>
                {selectedRoleIds.length > 0 && (
                  <Tip label="Each email will be assigned to all selected roles">
                    <span className="text-xs text-blue-500 font-medium cursor-default">
                      {selectedRoleIds.length} selected
                    </span>
                  </Tip>
                )}
              </div>

              <div ref={roleDropdownRef} className="relative">
                <Tip label="Click to pick one or more roles">
                  <button
                    type="button"
                    onClick={() => setRoleDropdownOpen((p) => !p)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white flex items-center justify-between"
                  >
                    <span className={selectedRoleIds.length === 0 ? "text-gray-400" : "text-gray-800"}>
                      {selectedRoleIds.length === 0
                        ? "Select roles..."
                        : `${selectedRoleIds.length} role${selectedRoleIds.length > 1 ? "s" : ""} selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${roleDropdownOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </Tip>

                {roleDropdownOpen && (
                  <div className="absolute z-10 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="max-h-44 overflow-y-auto py-1">
                      {roles.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-3">No roles available</p>
                      ) : (
                        roles.map((role: any) => {
                          const checked = selectedRoleIds.includes(Number(role.id));
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => toggleRole(Number(role.id))}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-all duration-150 ${checked ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
                                {checked && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-gray-700">{role.roleName}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {selectedRoleIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedRoleIds.map((id) => {
                    const role = roles.find((r) => Number(r.id) === id);
                    return (
                      <Tip key={id} label="Click × to deselect this role">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-lg border border-violet-100">
                          {role?.roleName}
                          <button
                            type="button"
                            onClick={() => removeRole(id)}
                            className="text-violet-400 hover:text-violet-700 transition-colors ml-0.5"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      </Tip>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
            <Tip label="Discard changes and close">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 transition-all duration-200"
              >
                Cancel
              </button>
            </Tip>

            <Tip label={
              !canSubmit
                ? "Add at least one email first"
                : selectedRoleIds.length === 0
                ? "Select at least one role"
                : `Save ${emailList.length || 1} email${(emailList.length || 1) > 1 ? "s" : ""} to ${selectedRoleIds.length} role${selectedRoleIds.length > 1 ? "s" : ""}`
            }>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-blue-200"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Save {emailList.length > 1 ? `${emailList.length} Emails` : "Email"}
                  </>
                )}
              </button>
            </Tip>
          </div>

        </div>
      </div>
    </Tooltip.Provider>
  );
}