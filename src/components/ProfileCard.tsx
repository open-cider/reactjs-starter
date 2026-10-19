import { buildProfileView } from "../lib/profile";

export default function ProfileCard({ profile }: { profile: unknown }) {
  const view = buildProfileView(profile);

  if (!view) {
    return <p className="muted">No profile details were returned for this account yet.</p>;
  }

  return (
    <article className="profile">
      <div className="profile-head">
        {view.avatarSrc ? (
          <img
            className="avatar"
            src={view.avatarSrc}
            alt={`${view.title ?? "Your"} avatar`}
            width={96}
            height={96}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="avatar avatar-fallback" aria-hidden="true">
            {view.initials}
          </div>
        )}
        <div>
          <h2 className="profile-name">{view.title ?? "Your profile"}</h2>
          {view.username && <p className="muted profile-username">@{view.username}</p>}
        </div>
      </div>

      {view.fields.length > 0 && (
        <dl className="fields">
          {view.fields.map((field) => (
            <div key={field.key}>
              <dt>{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
