import { authConfig, isAuthConfigured } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { LoginForm } from "./LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [settings, params] = await Promise.all([getSettings(), searchParams]);
  const config = authConfig();
  const configured = isAuthConfigured(config);

  // Only ever follow an internal dashboard path.
  const next =
    params.next && params.next.startsWith("/admin") ? params.next : "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="adm-label">{settings.site.name}</p>
        <h1 className="mt-2 text-2xl">Dashboard</h1>
        <p className="adm-help">Sign in to manage the site.</p>

        <div className="adm-panel mt-6 p-6">
          {configured ? (
            <LoginForm next={next} />
          ) : (
            <div className="space-y-3">
              <p className="text-[0.8125rem] font-semibold" style={{ color: "var(--a-danger)" }}>
                The dashboard is not configured yet.
              </p>
              <ul className="space-y-2">
                {config.problems.map((problem) => (
                  <li key={problem} className="adm-help !mt-0">
                    {problem}
                  </li>
                ))}
              </ul>
              <p className="adm-help">
                Run <code>npm run admin:password</code> to generate the values, then add them to
                your environment and restart.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
