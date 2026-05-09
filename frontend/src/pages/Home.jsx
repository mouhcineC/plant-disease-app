import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { detectPlantDisease } from "../services/scanService";
import { toPercent } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";
import TopNav from "../components/home/TopNav";
import Footer from "../components/home/Footer";
import image from "../utils/resource/354251.png";

const diseaseInsights = {
  "Early Blight": {
    description:
      "Early Blight is a fungal disease that creates dark concentric spots on older leaves and can reduce yields if left untreated.",
    recommendations: [
      "Remove and destroy affected leaves",
      "Avoid overhead watering and keep foliage dry",
      "Apply a fungicide approved for tomatoes",
      "Improve airflow between plants",
    ],
  },
  "Late Blight": {
    description:
      "Late Blight spreads quickly in cool, wet conditions and causes water-soaked lesions on leaves and stems.",
    recommendations: [
      "Remove infected plants immediately",
      "Avoid watering late in the day",
      "Use resistant plant varieties",
      "Apply preventive fungicide sprays",
    ],
  },
  "Powdery Mildew": {
    description:
      "Powdery Mildew appears as a white powder on leaf surfaces and thrives in humid environments.",
    recommendations: [
      "Prune to improve air circulation",
      "Avoid excess nitrogen fertilization",
      "Use sulfur or potassium bicarbonate sprays",
      "Water at the base of the plant",
    ],
  },
};

const defaultInsight = {
  description:
    "This disease can impact plant health and yield. Monitor the plant closely and take early action to reduce spread.",
  recommendations: [
    "Remove affected leaves",
    "Avoid overhead watering",
    "Use fungicides if necessary",
    "Improve air circulation",
  ],
};

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const uploadRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-reveal]");
    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const confidencePercent = useMemo(() => toPercent(prediction?.confidence), [prediction]);

  const confidenceLabel = confidencePercent >= 85 ? "High Confidence" : "Moderate Confidence";

  const insight = useMemo(() => {
    if (!prediction?.disease) {
      return defaultInsight;
    }
    return diseaseInsights[prediction.disease] || defaultInsight;
  }, [prediction]);

  const aiSolutions = useMemo(() => {
    if (!prediction?.solutions) {
      return [];
    }
    const { chemical, organic, prevention } = prediction.solutions;
    return [chemical, organic, prevention].filter(Boolean);
  }, [prediction]);

  const explanationText = prediction?.explanation || insight.description;
  const recommendations = aiSolutions.length ? aiSolutions : insight.recommendations;

  const handlePickFile = () => {
    uploadRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPrediction(null);
      setErrorMessage("");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPrediction(null);
    setErrorMessage("");
    if (uploadRef.current) {
      uploadRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPrediction(null);
      setErrorMessage("");
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) {
      setErrorMessage("Please upload a leaf image before running detection.");
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await detectPlantDisease(selectedFile);
      setPrediction(data || null);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || "Prediction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-emerald-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-950 via-emerald-950/95 to-emerald-950/90"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-24 right-24 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute left-10 top-52 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute bottom-16 right-8 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <TopNav />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-20">
        <section data-reveal className="reveal grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-900/30 px-4 py-2 text-xs font-semibold text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-glow" />
              Premium AI Plant Health Platform
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
              AI-Powered <span className="text-emerald-300">Plant Disease</span> Detection
            </h1>
            <p className="text-base text-emerald-100/80 md:text-lg">
              Upload a leaf image and let our advanced AI model detect diseases and deliver accurate
              recommendations instantly.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => document.getElementById("detect")?.scrollIntoView({ behavior: "smooth" })}
                className="rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-600/30 transition hover:scale-[1.02]"
              >
                Detect Disease
              </button>
              <Link
                to="/history"
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View History
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FeatureCard title="AI-Powered" subtitle="Deep learning model" />
              <FeatureCard title="Highly Accurate" subtitle="Trained on thousands of leaves" />
              <FeatureCard title="Fast Results" subtitle="Get results in seconds" />
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="absolute -left-8 top-10 h-56 w-56 rounded-full border border-emerald-300/30" />
            <div className="absolute bottom-0 right-4 h-72 w-72 rounded-full border border-emerald-300/20" />
            <div className="absolute left-14 top-20 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200/30 bg-emerald-900/30 p-6 shadow-2xl shadow-emerald-900/40 backdrop-blur-xl">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/30 blur-2xl" />
              <img
                src={image}
                alt="Leaf illustration"
                className="h-72 w-full rounded-2xl object-cover"
              />
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-emerald-100/30 bg-emerald-950/40 px-4 py-3 text-sm">
                <div>
                  <p className="text-emerald-100/80">Live AI Detection</p>
                  <p className="font-semibold text-white">Scanning leaf tissue...</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                  <RadarIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          data-reveal
          className="reveal mt-20 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-white/90 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:grid-cols-3"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/60">Why LeafDiagnose</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Precision AI for plant health.</h2>
            <p className="mt-3 text-sm text-emerald-100/70">
              Built for researchers, growers, and students who need trusted, fast, and accurate
              plant disease detection.
            </p>
          </div>
          <div className="space-y-4">
            <FeatureLine title="Clinical-grade clarity" subtitle="Clear results with confidence scoring." />
            <FeatureLine title="Secure by design" subtitle="JWT protected endpoints and private history." />
          </div>
          <div className="space-y-4">
            <FeatureLine title="Fast and reliable" subtitle="AI results in seconds with cloud delivery." />
            <FeatureLine title="Action-ready" subtitle="Recommendations tailored for growers." />
          </div>
        </section>

        <section data-reveal id="detect" className="reveal mt-24 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 animate-fade-up">
            <SectionTitle
              title="Detect Plant Disease"
              subtitle="Drag and drop a leaf image below or click to browse"
            />

            <div
              className={`flex min-h-[260px] flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition ${
                isDragging
                  ? "border-emerald-300 bg-emerald-900/50"
                  : "border-emerald-200/40 bg-emerald-950/40"
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-200">
                <UploadIcon className="h-6 w-6" />
              </div>
              <p className="mt-4 text-base font-semibold text-white">Drop your leaf image here</p>
              <p className="mt-1 text-sm text-emerald-100/70">or click to upload</p>
              <p className="mt-4 text-xs text-emerald-200/60">Supports: JPG, PNG, WEBP (Max 10MB)</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePickFile}
                  className="rounded-full border border-emerald-200/40 px-4 py-2 text-xs font-semibold text-emerald-50 transition hover:bg-emerald-900/60"
                >
                  Browse file
                </button>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    Remove image
                  </button>
                )}
              </div>
              <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {errorMessage && (
              <p className="rounded-2xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleDetect}
              disabled={isLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Detecting...
                </span>
              ) : (
                "Detect Disease"
              )}
            </button>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-emerald-950 shadow-xl shadow-emerald-900/10">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Uploaded Image</h3>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-xs font-semibold text-emerald-600 transition hover:text-emerald-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100/80 bg-emerald-50/80">
                {previewUrl ? (
                  <img src={previewUrl} alt="Uploaded leaf" className="h-56 w-full object-cover" />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-emerald-700/70">
                    Upload a leaf image to preview it here.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/90 p-6 text-emerald-950 shadow-xl shadow-emerald-900/10">
              <h3 className="text-base font-semibold">Prediction Result</h3>
              <div className="mt-4 space-y-4">
                {prediction ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-emerald-700/70">Plant</p>
                        <p className="text-lg font-semibold text-emerald-950">
                          {prediction.plant || "Unknown"}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {confidenceLabel}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-700/70">Disease</p>
                      <p className="text-lg font-semibold text-emerald-950">
                        {prediction.disease || "Not detected"}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm text-emerald-700/70">
                        <span>Confidence score</span>
                        <span className="font-semibold text-emerald-900">{confidencePercent}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-emerald-100">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
                          style={{ width: `${confidencePercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
                      <p className="text-sm font-semibold text-emerald-900">About this disease</p>
                      <p className="text-sm text-emerald-700/70">{explanationText}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-emerald-900">Recommendations</p>
                      <ul className="mt-2 space-y-2 text-sm text-emerald-700/70">
                        {recommendations.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-amber-200/60 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                      This is an AI prediction. Please consult an expert for full diagnosis.
                    </div>
                  </>
                ) : isLoading ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-6 text-sm text-emerald-700/70">
                    <Spinner className="h-5 w-5 text-emerald-600" />
                    Waiting for AI prediction...
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-8 text-center text-sm text-emerald-700/70">
                    Run detection to see prediction results here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-emerald-100/70">{subtitle}</p>
    </div>
  );
}

function FeatureCard({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-emerald-100/20 bg-emerald-900/30 px-4 py-3 text-sm text-emerald-100/80 shadow-lg shadow-emerald-900/30">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-emerald-100/60">{subtitle}</p>
    </div>
  );
}

function FeatureLine({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-emerald-900/30 px-4 py-3">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-emerald-100/70">{subtitle}</p>
    </div>
  );
}

function UploadIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 16V8" strokeLinecap="round" />
      <path d="m8 12 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="4" width="16" height="16" rx="4" strokeLinecap="round" />
    </svg>
  );
}

function RadarIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v8l6 6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function LeafDecoration({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path
        d="M3 13c6-7 13-8 18-7-1 6-5 12-13 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 18c1.5-2.5 4-4.5 7-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner({ className }) {
  return (
    <svg
      className={`${className} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" className="opacity-20" />
      <path d="M21 12a9 9 0 0 1-9 9" strokeLinecap="round" />
    </svg>
  );
}

export default Home;

