import "./Credits.css";

export default function Credits() {
  return (
    <aside className="credits">
      <p>
        Un jeu par <strong>Mario Universalis</strong>.
      </p>
      <menu>
        <li>
          <a
            href="https://x.com/MarioUnivRsalis"
            className="social-logo x"
            title="Suivre sur X"
          >
            @MarioUnivRsalis
          </a>
        </li>
        <li>
          <a
            href="https://bsky.app/profile/mariouniversalis.fr"
            className="social-logo bluesky"
            title="Suivre sur Bluesky"
          >
            @mariouniversalis.fr
          </a>
        </li>
      </menu>
    </aside>
  );
}
