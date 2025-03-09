import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">GyanGen</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button
            onClick={() => navigate("/login", { state: { tab: "register" } })}
          >
            Sign Up
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Comprehensive Learning Management System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Personalized learning experiences for corporates, colleges, and
            schools with advanced administration and scheduling capabilities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/login")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">
                  Personalized Dashboard
                </h3>
                <p className="text-muted-foreground">
                  Track your progress, view enrolled courses, and get
                  personalized recommendations.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">
                  Course Management
                </h3>
                <p className="text-muted-foreground">
                  Browse, filter, and enroll in courses with integrated
                  assessments and certificates.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">
                  Scheduling System
                </h3>
                <p className="text-muted-foreground">
                  Book sessions with professional trainers with calendar
                  integration and reminders.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">GyanGen</h2>
          <p className="text-muted-foreground mb-6">
            Advanced Learning Management System
          </p>
          <p className="text-sm text-muted-foreground">
            © 2023 GyanGen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
