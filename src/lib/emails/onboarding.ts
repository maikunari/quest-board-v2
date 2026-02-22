/**
 * Onboarding email templates for Quest Board trial sequence.
 * All four emails: welcome, day2, day5, day7.
 * Dark RPG theme, sage mascot voice, ADHD-friendly messaging.
 */

const BASE_URL = 'https://questboard.sh'
const FROM = 'Quest Board <noreply@questboard.sh>'

// ─── Shared layout wrapper ─────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#0a0612;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0612;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;">

          <!-- Logo wordmark -->
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <span style="font-size:12px;letter-spacing:4px;color:#7c3aed;font-weight:700;text-transform:uppercase;">⚔️ QUEST BOARD ⚔️</span>
            </td>
          </tr>

          ${content}

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:40px;border-top:1px solid #1e1033;">
              <p style="margin:0 0 8px;color:#3d2e6b;font-size:11px;">
                Built by an ADHD brain, for every brain that needed more than a checkbox.
              </p>
              <p style="margin:0;color:#2d1f5a;font-size:11px;">
                <a href="${BASE_URL}" style="color:#6d28d9;text-decoration:none;">questboard.sh</a>
                &nbsp;·&nbsp;
                <a href="${BASE_URL}/settings" style="color:#3d2e6b;text-decoration:none;">Manage notifications</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Reusable button
function ctaButton(text: string, href: string, color = '#6d28d9'): string {
  return `<a href="${href}" style="display:inline-block;background-color:${color};color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;letter-spacing:0.2px;">${text}</a>`
}

// Stat pill
function statPill(emoji: string, value: string, label: string): string {
  return `
  <td align="center" style="padding:0 8px;">
    <div style="background-color:#1a0d33;border:1px solid #3b1f6e;border-radius:12px;padding:16px 20px;min-width:90px;">
      <div style="font-size:24px;margin-bottom:6px;">${emoji}</div>
      <div style="color:#c4b5fd;font-size:20px;font-weight:700;margin-bottom:2px;">${value}</div>
      <div style="color:#5b4a8a;font-size:11px;">${label}</div>
    </div>
  </td>`
}

// ─── Email 1: Welcome (sent immediately on signup) ─────────────────────────

export function buildWelcomeEmail(name: string): { subject: string; html: string } {
  const displayName = name?.split(' ')[0] || 'Adventurer'
  const subject = `⚔️ Your quest begins, ${displayName}!`

  const html = emailWrapper(`
    <!-- Sage image -->
    <tr>
      <td align="center" style="padding-bottom:28px;">
        <img
          src="${BASE_URL}/mascot/sage-default.png"
          alt="The Hooded Sage"
          width="140"
          style="display:block;width:140px;height:auto;"
        />
      </td>
    </tr>

    <!-- Speech bubble from Sage -->
    <tr>
      <td align="center" style="padding-bottom:28px;">
        <div style="display:inline-block;background-color:#1a0d33;border:1px solid #4c1d95;border-radius:16px;padding:14px 22px;max-width:380px;">
          <p style="margin:0;color:#c4b5fd;font-size:13px;line-height:1.6;font-style:italic;">
            &ldquo;Ah, a new adventurer arrives. I&rsquo;ve been waiting for you. Your quest board is ready.&rdquo;
          </p>
        </div>
      </td>
    </tr>

    <!-- Heading -->
    <tr>
      <td align="center" style="padding-bottom:12px;">
        <h1 style="margin:0;color:#f0ebff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
          Welcome to Quest Board, ${displayName}!
        </h1>
      </td>
    </tr>

    <!-- Subhead -->
    <tr>
      <td align="center" style="padding-bottom:28px;">
        <p style="margin:0;color:#8b7ab8;font-size:15px;line-height:1.5;">
          You&rsquo;ve got <strong style="color:#c4b5fd;">7 days to explore everything</strong> — no limits, no credit card needed.
        </p>
      </td>
    </tr>

    <!-- Body copy -->
    <tr>
      <td style="padding-bottom:32px;">
        <p style="margin:0 0 14px;color:#8b7ab8;font-size:15px;line-height:1.7;">
          Quest Board was built because every other productivity app felt like homework.
          If you&rsquo;ve got an ADHD brain (or just a brain that gets bored easily), you already know the feeling:
          the app looks great, you add a few tasks... and then you never open it again.
        </p>
        <p style="margin:0;color:#8b7ab8;font-size:15px;line-height:1.7;">
          This one is different. The XP, the streaks, the ranks — they aren&rsquo;t decoration.
          They&rsquo;re the dopamine loop your brain actually needs to <em style="color:#c4b5fd;">start</em>, and keep going.
        </p>
      </td>
    </tr>

    <!-- 3 quick-start steps -->
    <tr>
      <td style="padding-bottom:36px;">
        <div style="background-color:#110a24;border:1px solid #2d1f5a;border-radius:16px;padding:24px 24px 16px;">
          <p style="margin:0 0 16px;color:#a78bfa;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Your First 3 Quests</p>
          ${[
            ['⚔️', 'Create your first quest', 'Hit "+ Add Quest" and write down one thing you need to do. That&rsquo;s it.'],
            ['⭐', 'Complete it and collect your XP', 'Check it off. Watch that XP number go up. Feel the difference.'],
            ['🔥', 'Come back tomorrow to start a streak', 'Just one quest a day keeps the streak alive. The multiplier kicks in fast.'],
          ].map(([icon, title, desc]) => `
          <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;width:100%;">
            <tr>
              <td style="width:40px;vertical-align:top;padding-top:2px;">
                <span style="font-size:22px;">${icon}</span>
              </td>
              <td style="vertical-align:top;">
                <strong style="color:#e2d9ff;font-size:14px;">${title}</strong>
                <p style="margin:2px 0 0;color:#6b5a99;font-size:13px;line-height:1.5;">${desc}</p>
              </td>
            </tr>
          </table>`).join('')}
        </div>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td align="center" style="padding-bottom:12px;">
        ${ctaButton('Begin Your Quest →', `${BASE_URL}/quests`)}
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:0;">
        <p style="margin:0;color:#3d2e6b;font-size:12px;">7-day free trial · No credit card required</p>
      </td>
    </tr>
  `)

  return { subject, html }
}

// ─── Email 2: Day 2 — Tips ─────────────────────────────────────────────────

export function buildDay2Email(name: string): { subject: string; html: string } {
  const displayName = name?.split(' ')[0] || 'Adventurer'
  const subject = `📜 The Sage has tips for you, ${displayName}`

  const html = emailWrapper(`
    <!-- Heading -->
    <tr>
      <td align="center" style="padding-bottom:8px;">
        <p style="margin:0;color:#7c3aed;font-size:11px;letter-spacing:3px;font-weight:700;text-transform:uppercase;">Day 2 of 7</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:12px;">
        <h1 style="margin:0;color:#f0ebff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
          The Sage&rsquo;s Guide to Getting Started
        </h1>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:32px;">
        <p style="margin:0;color:#8b7ab8;font-size:14px;line-height:1.6;">
          You&rsquo;ve entered the guild. Here&rsquo;s how to actually level up.
        </p>
      </td>
    </tr>

    <!-- How XP works -->
    <tr>
      <td style="padding-bottom:20px;">
        <div style="background-color:#110a24;border:1px solid #2d1f5a;border-radius:16px;padding:22px 24px;">
          <p style="margin:0 0 6px;color:#a78bfa;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">How XP Works</p>
          <p style="margin:0;color:#8b7ab8;font-size:14px;line-height:1.7;">
            Each quest type pays out differently: <strong style="color:#c4b5fd;">Main Quests</strong> give the most XP (big stuff),
            <strong style="color:#c4b5fd;">Side Quests</strong> are medium, and
            <strong style="color:#c4b5fd;">Daily Quests</strong> are small but stack fast with your streak multiplier.
            Earn enough XP and you rank up — Seedling → Adventurer → Warrior → Ranger → Champion.
          </p>
        </div>
      </td>
    </tr>

    <!-- How streaks work -->
    <tr>
      <td style="padding-bottom:20px;">
        <div style="background-color:#110a24;border:1px solid #2d1f5a;border-radius:16px;padding:22px 24px;">
          <p style="margin:0 0 6px;color:#f59e0b;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">🔥 Streaks = Multiplied XP</p>
          <p style="margin:0;color:#8b7ab8;font-size:14px;line-height:1.7;">
            Complete at least one quest every day and your streak grows.
            At 3 days you&rsquo;re at 1.5×. At 7 days, 2× XP. At 30 days, 3× everything.
            The catch: miss a day and it resets. This is intentional — the <em>cost</em> of breaking it is what makes it work.
          </p>
        </div>
      </td>
    </tr>

    <!-- ADHD tips -->
    <tr>
      <td style="padding-bottom:32px;">
        <div style="background-color:#0f1a12;border:1px solid #1a3d24;border-radius:16px;padding:22px 24px;">
          <p style="margin:0 0 14px;color:#4ade80;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">🧠 ADHD-Friendly Tips</p>
          ${[
            ['Keep quests tiny', 'Break everything down. "Write report" is not a quest. "Write first paragraph" is.'],
            ['Use Daily Quests for habits', 'Brush teeth, drink water, inbox zero — tiny repeating quests build the streak and the brain.'],
            ['3 quests minimum', 'On bad days, aim for three small quests. Done. Streak saved. Self-image intact.'],
            ['Name your quests dramatically', '"Defeat the email backlog" &gt; "reply to emails". Your brain will thank you.'],
          ].map(([title, desc]) => `
          <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;width:100%;">
            <tr>
              <td style="width:24px;vertical-align:top;padding-top:2px;">
                <span style="color:#4ade80;font-size:14px;">✓</span>
              </td>
              <td>
                <strong style="color:#d1fae5;font-size:14px;">${title}</strong>
                <p style="margin:2px 0 0;color:#5b7a65;font-size:13px;line-height:1.5;">${desc}</p>
              </td>
            </tr>
          </table>`).join('')}
        </div>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td align="center" style="padding-bottom:8px;">
        ${ctaButton('Open Your Quest Board →', `${BASE_URL}/quests`)}
      </td>
    </tr>
    <tr>
      <td align="center">
        <p style="margin:0;color:#3d2e6b;font-size:12px;">5 days left in your free trial</p>
      </td>
    </tr>
  `)

  return { subject, html }
}

// ─── Email 3: Day 5 — Engagement nudge ────────────────────────────────────

export interface TrialStats {
  xp: number
  questsCompleted: number
  currentStreak: number
}

export function buildDay5Email(name: string, stats: TrialStats): { subject: string; html: string } {
  const displayName = name?.split(' ')[0] || 'Adventurer'
  const subject = `⏳ 2 days left, ${displayName} — here's how far you've come`

  const html = emailWrapper(`
    <!-- Heading -->
    <tr>
      <td align="center" style="padding-bottom:8px;">
        <p style="margin:0;color:#7c3aed;font-size:11px;letter-spacing:3px;font-weight:700;text-transform:uppercase;">Day 5 of 7</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:12px;">
        <h1 style="margin:0;color:#f0ebff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">
          You&rsquo;ve been on this adventure 5 days.
        </h1>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:28px;">
        <p style="margin:0;color:#8b7ab8;font-size:14px;line-height:1.6;">
          Your trial ends in 2 days. Here&rsquo;s your current standing, adventurer.
        </p>
      </td>
    </tr>

    <!-- Stats grid -->
    <tr>
      <td style="padding-bottom:32px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            ${statPill('⭐', stats.xp.toLocaleString(), 'XP Earned')}
            ${statPill('⚔️', stats.questsCompleted.toString(), 'Quests Done')}
            ${statPill('🔥', `${stats.currentStreak}d`, 'Streak')}
          </tr>
        </table>
      </td>
    </tr>

    <!-- What happens at end of trial -->
    <tr>
      <td style="padding-bottom:32px;">
        <div style="background-color:#1f0d0d;border:1px solid #4a1010;border-radius:16px;padding:22px 24px;">
          <p style="margin:0 0 14px;color:#f87171;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">⚠️ What Happens If You Don&rsquo;t Upgrade</p>
          ${[
            'Your quest history and XP are frozen',
            'Streak resets — that chain you\'ve been building? Gone.',
            'You lose access to your integrations and stats',
            'The Sage is very disappointed',
          ].map(item => `
          <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;width:100%;">
            <tr>
              <td style="width:20px;vertical-align:top;padding-top:2px;">
                <span style="color:#f87171;font-size:13px;">✗</span>
              </td>
              <td>
                <p style="margin:0;color:#9a6a6a;font-size:13px;line-height:1.5;">${item}</p>
              </td>
            </tr>
          </table>`).join('')}
        </div>
      </td>
    </tr>

    <!-- What you keep with upgrade -->
    <tr>
      <td style="padding-bottom:32px;">
        <div style="background-color:#0a1a0f;border:1px solid #14532d;border-radius:16px;padding:22px 24px;">
          <p style="margin:0 0 14px;color:#4ade80;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">✦ What You Keep With Champion ($5/mo)</p>
          ${[
            'All your XP, levels, and history — nothing lost',
            'Your streak and multiplier stay intact',
            'Unlimited integrations (Asana + more coming)',
            'Streak freeze once a week — for the bad days',
            'Advanced stats and insights',
          ].map(item => `
          <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;width:100%;">
            <tr>
              <td style="width:20px;vertical-align:top;padding-top:2px;">
                <span style="color:#4ade80;font-size:13px;">✓</span>
              </td>
              <td>
                <p style="margin:0;color:#5b7a65;font-size:13px;line-height:1.5;">${item}</p>
              </td>
            </tr>
          </table>`).join('')}
        </div>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td align="center" style="padding-bottom:8px;">
        ${ctaButton('Upgrade to Champion →', `${BASE_URL}/pricing`, '#7c3aed')}
      </td>
    </tr>
    <tr>
      <td align="center">
        <p style="margin:0;color:#3d2e6b;font-size:12px;">$5/mo · Cancel anytime · No surprise charges</p>
      </td>
    </tr>
  `)

  return { subject, html }
}

// ─── Email 4: Day 7 — Trial ending ────────────────────────────────────────

export function buildDay7Email(name: string, stats: TrialStats): { subject: string; html: string } {
  const displayName = name?.split(' ')[0] || 'Adventurer'
  const subject = `🔔 Your trial ends today, ${displayName} — don't lose your progress`

  const html = emailWrapper(`
    <!-- Sage triumph image -->
    <tr>
      <td align="center" style="padding-bottom:24px;">
        <img
          src="${BASE_URL}/mascot/sage-triumph.png"
          alt="The Hooded Sage"
          width="120"
          style="display:block;width:120px;height:auto;"
        />
      </td>
    </tr>

    <!-- Heading -->
    <tr>
      <td align="center" style="padding-bottom:8px;">
        <p style="margin:0;color:#f59e0b;font-size:11px;letter-spacing:3px;font-weight:700;text-transform:uppercase;">⚔️ Day 7 — Trial Ends Today</p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:12px;">
        <h1 style="margin:0;color:#f0ebff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
          This is what you&rsquo;ve built, ${displayName}.
        </h1>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:28px;">
        <p style="margin:0;color:#8b7ab8;font-size:14px;line-height:1.6;max-width:380px;display:inline-block;">
          Seven days ago you started your quest. Here&rsquo;s the score — and what happens next.
        </p>
      </td>
    </tr>

    <!-- Stats grid -->
    <tr>
      <td style="padding-bottom:32px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            ${statPill('⭐', stats.xp.toLocaleString(), 'XP Earned')}
            ${statPill('⚔️', stats.questsCompleted.toString(), 'Quests Done')}
            ${statPill('🔥', `${stats.currentStreak}d`, 'Current Streak')}
          </tr>
        </table>
      </td>
    </tr>

    <!-- Sage quote -->
    <tr>
      <td align="center" style="padding-bottom:32px;">
        <div style="display:inline-block;background-color:#1a0d33;border:1px solid #4c1d95;border-radius:16px;padding:16px 24px;max-width:380px;">
          <p style="margin:0;color:#c4b5fd;font-size:13px;line-height:1.6;font-style:italic;">
            &ldquo;Seven days. ${stats.questsCompleted} quests conquered. That chain of ${stats.currentStreak}
            ${stats.currentStreak === 1 ? 'day' : 'days'} you&rsquo;ve built — it would be a shame to let it fade into legend.&rdquo;
          </p>
          <p style="margin:8px 0 0;color:#5b4a8a;font-size:11px;">— The Sage</p>
        </div>
      </td>
    </tr>

    <!-- Pricing breakdown, simple -->
    <tr>
      <td style="padding-bottom:32px;">
        <div style="background-color:#110a24;border:1px solid #2d1f5a;border-radius:16px;padding:22px 24px;">
          <p style="margin:0 0 16px;color:#a78bfa;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Pick Your Plan</p>
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom:12px;vertical-align:top;padding-right:12px;">
                <div style="background-color:#1a0d33;border:1px solid #6d28d9;border-radius:12px;padding:16px;">
                  <p style="margin:0 0 4px;color:#c4b5fd;font-size:13px;font-weight:700;">⚔️ Champion</p>
                  <p style="margin:0 0 8px;color:#7c3aed;font-size:22px;font-weight:800;">$5<span style="font-size:13px;color:#5b4a8a;">/mo</span></p>
                  <p style="margin:0;color:#6b5a99;font-size:12px;line-height:1.5;">All features, unlimited integrations, streak freeze, advanced stats.</p>
                </div>
              </td>
              <td style="padding-bottom:12px;vertical-align:top;">
                <div style="background-color:#1a0d33;border:1px solid #3b1f6e;border-radius:12px;padding:16px;">
                  <p style="margin:0 0 4px;color:#c4b5fd;font-size:13px;font-weight:700;">🏰 Guild Master</p>
                  <p style="margin:0 0 8px;color:#7c3aed;font-size:22px;font-weight:800;">$8<span style="font-size:13px;color:#5b4a8a;">/mo/user</span></p>
                  <p style="margin:0;color:#6b5a99;font-size:12px;line-height:1.5;">Shared boards, team analytics, guild challenges, admin controls.</p>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>

    <!-- Primary CTA -->
    <tr>
      <td align="center" style="padding-bottom:12px;">
        ${ctaButton('Keep My Progress — Upgrade Now →', `${BASE_URL}/pricing`, '#7c3aed')}
      </td>
    </tr>
    <tr>
      <td align="center">
        <p style="margin:0;color:#3d2e6b;font-size:12px;">No credit card stored · Cancel anytime · Your XP stays with you</p>
      </td>
    </tr>
  `)

  return { subject, html }
}

export { FROM }
