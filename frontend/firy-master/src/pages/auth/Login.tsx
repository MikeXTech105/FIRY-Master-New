import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../../services/authService";

type LoginForm = {
  email: string;
  password: string;
};

const onSubmit = async (data: LoginForm) => {
  try {
    const res = await loginUser(data);
    if (res.statusCode === 1) {
      alert("Login Successful");
      window.location.href = "/dashboard";
    } else {
      alert("Invalid Login");
    }
  } catch (error) {
    console.error(error);
  }
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 800,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      vz: Math.random() * 1.2 + 0.2,
      size: Math.random() * 2.2 + 0.8,
    }));

    let animationFrame = 0;

    const draw = () => {
      context.fillStyle = "rgba(2, 6, 23, 0.32)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      particles.forEach((particle, index) => {
        particle.z -= particle.vz;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.z <= 0) particle.z = 800;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        const scale = 800 / (800 + particle.z);
        const scaledX = (particle.x - centerX) * scale + centerX;
        const scaledY = (particle.y - centerY) * scale + centerY;
        const radius = particle.size * scale;

        context.beginPath();
        context.arc(scaledX, scaledY, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(56, 189, 248, ${scale * 0.95})`;
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const next = particles[nextIndex];
          const nextScale = 800 / (800 + next.z);
          const nextX = (next.x - centerX) * nextScale + centerX;
          const nextY = (next.y - centerY) * nextScale + centerY;
          const distance = Math.hypot(scaledX - nextX, scaledY - nextY);

          if (distance < 110) {
            context.beginPath();
            context.moveTo(scaledX, scaledY);
            context.lineTo(nextX, nextY);
            context.strokeStyle = `rgba(99, 102, 241, ${(1 - distance / 110) * 0.18})`;
            context.lineWidth = 0.6;
            context.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const highlights = [
    "Unified hiring dashboard and communication workflows",
    "Quick access to role management and outreach operations",
    "Modern analytics-first interface for day-to-day recruiting",
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-950">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.22),transparent_35%)]" />

      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden flex-col justify-between px-8 py-10 lg:flex xl:px-16">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              FiryMaster platform
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white">
                Redefined hiring operations for fast-moving teams.
              </h1>
              <p className="max-w-lg text-lg leading-8 text-slate-300">
                Manage candidates, permissions, email campaigns, and configuration from one focused workspace built for recruiters and admins.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item, index) => (
              <div key={item} className="glass-panel p-5">
                <p className="text-sm font-semibold text-cyan-200">0{index + 1}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-2xl sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2.75 4.75 13h5.5L11 21.25 19.25 11H13V2.75Z" />
                  </svg>
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-400">Sign in to access your redesigned recruitment workspace.</p>
              </div>
              <div className="hidden rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-right sm:block">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Status</p>
                <p className="mt-1 text-sm font-semibold text-emerald-200">Systems ready</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Work email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  {...register("email", { required: "Email is required" })}
                  className="input-shell"
                />
                {errors.email ? <p className="mt-2 text-xs text-rose-300">{errors.email.message}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", { required: "Password is required" })}
                    className="input-shell pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 18 18M10.477 10.479A3 3 0 0 0 13.5 13.5m4.422 4.424A10.452 10.452 0 0 1 12 19.5c-4.592 0-8.49-2.95-9.945-7.064a10.453 10.453 0 0 1 3.278-4.568m3.548-1.956A10.45 10.45 0 0 1 12 4.5c4.592 0 8.49 2.95 9.945 7.064a10.459 10.459 0 0 1-1.82 3.043M14.12 14.122 9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1 1 0 0 1 0-.644C3.423 7.51 7.36 4.5 12 4.5s8.577 3.01 9.964 7.178a1 1 0 0 1 0 .644C20.577 16.49 16.64 19.5 12 19.5S3.423 16.49 2.036 12.322Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-xs text-rose-300">{errors.password.message}</p> : null}
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="inline-flex items-center gap-2 text-slate-400">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-slate-900 text-cyan-400 focus:ring-cyan-400/30" />
                  Keep me signed in
                </label>
                <a href="#" className="font-medium text-cyan-300 transition hover:text-cyan-200">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 text-base">
                Sign in to dashboard
              </button>
            </form>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-2xl font-semibold text-white">24/7</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">access</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-2xl font-semibold text-white">All pages</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">refreshed UI</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-2xl font-semibold text-white">1 hub</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">for operations</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
