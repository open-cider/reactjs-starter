// Framework-agnostic: turns the Open Cider profile document into what the profile card shows.
type Entry = [string, unknown];

export type ProfileView = {
  title: string | null;
  username: string | null;
  avatarSrc: string | null;
  initials: string;
  fields: { key: string; label: string; value: string }[];
};

const NAME_KEYS = ["displayName", "display_name", "fullName", "full_name", "name", "username"];

function findStringKey(entries: Entry[], candidates: string[]): string | null {
  for (const candidate of candidates) {
    const hit = entries.find(
      ([key, value]) => key.toLowerCase() === candidate.toLowerCase() && typeof value === "string" && value
    );
    if (hit) return hit[0];
  }
  return null;
}

function findAvatarKey(entries: Entry[]): string | null {
  for (const pattern of [/avatar/i, /picture|photo|image/i]) {
    const hit = entries.find(([key, value]) => pattern.test(key) && typeof value === "string" && value);
    if (hit) return hit[0];
  }
  return null;
}

const isImageSrc = (value: string) => /^(https?:\/\/|data:image\/|\/)/.test(value);

function label(key: string): string {
  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function display(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value, null, 2);
}

function initials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function buildProfileView(profile: unknown): ProfileView | null {
  const entries: Entry[] =
    profile && typeof profile === "object" ? Object.entries(profile as Record<string, unknown>) : [];
  if (entries.length === 0) return null;

  const record = Object.fromEntries(entries) as Record<string, unknown>;

  const avatarKey = findAvatarKey(entries);
  const avatarValue = avatarKey ? (record[avatarKey] as string) : null;
  const avatarSrc = avatarValue && isImageSrc(avatarValue) ? avatarValue : null;

  const titleKey = findStringKey(entries, NAME_KEYS);
  const title = titleKey ? (record[titleKey] as string) : null;

  // Show the username under the name when both exist and differ.
  const usernameKey = titleKey !== "username" ? findStringKey(entries, ["username"]) : null;
  const username = usernameKey ? (record[usernameKey] as string).replace(/^@/, "") : null;

  const hidden = new Set([avatarKey, titleKey, usernameKey].filter((k): k is string => Boolean(k)));
  const fields = entries
    .filter(([key]) => !hidden.has(key))
    .map(([key, value]) => ({ key, label: label(key), value: display(value) }));

  return { title, username, avatarSrc, initials: initials(title), fields };
}
