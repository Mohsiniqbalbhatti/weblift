import Analytics from "../components/Analytics";
import astro from "../assets/Astro.png";
import react from "../assets/React.png";
import nuxt from "../assets/Nuxt.png";
import { Link } from "react-router-dom";
function Home() {
  return (
    <>
      <div className="row justify-content-center ">
        <div className="col-12 mt-5 pt-5">
          <h1 className="brand-text mt-5 pt-5">Lift Your Site in Minutes!</h1>
        </div>
        <div className="col-10 mt-0">
          <p className="home-text">
            Deploy your static site effortlessly—simply connect your GitHub
            repository or drop your files, and watch your site go live in
            moments. Enjoy seamless integration with popular frameworks ensuring
            a smooth, fast, and reliable launch.
          </p>
        </div>
        <div className="col-3 d-flex justify-content-around">
          <button className="btn btn-main">Deploy Now</button>
          <button className="btn btn-2nd">Quick Guide</button>
        </div>
      </div>

      <Analytics />
      <div className="row  justify-content-center flex-column align-items-center my-3">
        <h2 className="brand-text mt-5">One Platform All your Sites!</h2>
        <p className="text-light text-center w-75">
          A developer experience that just works–optimized builds, collaborative
          previews, and instant rollbacks on a global edge network. Focus on
          your users and code while we handle the rest.
        </p>
      </div>
      <div className="row justify-content-center mb-5 pb-5">
        <div className="col-11">
          <div className="row">
            <div className="col-4">
              <div className="card my-4">
                <h4 className="card-title text-center ">
                  Multiple Deployments🔄
                </h4>

                <p className="card-text py-3 text-justify">
                  Deploy multiple versions to a single project so you can make
                  changes without disrupting your live site.
                </p>
              </div>
            </div>
            <div className="col-4">
              <div className="card my-4">
                <h4 className="card-title text-center ">
                  Instant Deployment 🚀
                </h4>

                <p className="card-text py-3 text-justify">
                  Deploy your static site in moments by connecting your GitHub
                  repository or uploading your files.
                </p>
              </div>
            </div>
            <div className="col-4">
              <div className="card my-4">
                <h4 className="card-title text-center ">
                  Seamless Integrations 🔌
                </h4>

                <p className="card-text py-3 text-justify">
                  Integrate with popular frameworks such as React.js, Next.js,
                  Angular effortlessly for a smooth and reliable launch
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h3 className="text-cream text-uppercase text-center">
            Get complete build Guide for your FrameWorks
          </h3>
        </div>
        <div className="col-12">
          {" "}
          <div className="row">
            <div className="col-4">
              <div className="card my-4 d-flex  justify-content-center flex-column align-items-center py-3 cursor-pointer">
                <div className="img-box my-3">
                  <img
                    src={astro}
                    alt="Astro"
                    className="img-fluid"
                    style={{
                      maxWidth: "90%",
                    }}
                  />
                </div>
                <h4 className=" text-center ">Build and Deploy with Astro</h4>
              </div>
            </div>
            <div className="col-4">
              <div className="card my-4 d-flex  justify-content-center flex-column align-items-center py-3 cursor-pointer">
                <div className="img-box my-3">
                  <img
                    src={nuxt}
                    alt="Astro"
                    className="img-fluid"
                    style={{
                      maxWidth: "80%",
                    }}
                  />
                </div>
                <h4 className=" text-center ">Build and Deploy with Nuxt</h4>
              </div>
            </div>
            <div className="col-4">
              <div className="card my-4 d-flex  justify-content-center flex-column align-items-center py-3 cursor-pointer">
                <div className="img-box my-3">
                  <img
                    src={react}
                    alt="Astro"
                    className="img-fluid"
                    style={{
                      maxWidth: "90%",
                    }}
                  />
                </div>
                <h4 className=" text-center ">
                  Build and Deploy with React.js
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mb-3">
          <p className="text-center  text-light text-center">
            Head over to our docs for a full list of framework configurations.
            <br />
            <Link>Go to the Docs!</Link>
          </p>
        </div>
        <div className="col-12 my-5 d-flex  justify-content-center flex-column align-items-center">
          <h3 className="text-cream text-uppercase text-center">
            Ready to lift your first site?{" "}
          </h3>
          <button className="btn-main">Request a Demo</button>
        </div>
      </div>
      <div className="row my-5 justify-content-center flex-column align-items-center ">
        <div className="col-12">
          <h3 className="text-cream text-uppercase text-center mb-4">
            Have a look on Frequently asked Questions !
          </h3>
        </div>
        <div className="col-8">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqOne"
                  aria-expanded="true"
                  aria-controls="faqOne"
                >
                  How does deployment work?
                </button>
              </h2>
              <div
                id="faqOne"
                className="accordion-collapse collapse show"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>Instant Deployment:</strong> Connect your GitHub
                  repository or upload your files, and your site goes live in
                  moments.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqTwo"
                  aria-expanded="false"
                  aria-controls="faqTwo"
                >
                  What analytics features do you offer?
                </button>
              </h2>
              <div
                id="faqTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>Real-Time Analytics:</strong> Monitor your site's
                  performance with interactive charts that provide detailed
                  visitor metrics in real time.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqThree"
                  aria-expanded="false"
                  aria-controls="faqThree"
                >
                  What integrations are available?
                </button>
              </h2>
              <div
                id="faqThree"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>Seamless Integrations:</strong> Enjoy smooth
                  integrations with popular frameworks for a fast, efficient
                  deployment process.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faqFour"
                  aria-expanded="false"
                  aria-controls="faqFour"
                >
                  Can I deploy multiple versions of my project?
                </button>
              </h2>
              <div
                id="faqFour"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <strong>Multiple Deployments:</strong> Yes, deploy multiple
                  versions to a single project so you can make changes without
                  disrupting your live site.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
