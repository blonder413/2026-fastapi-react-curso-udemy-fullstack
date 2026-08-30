import Footer from "../components/Footer";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="wrapper">
      <div className="main">
        <Header />
        <main className="content">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-3">{`${import.meta.env.VITE_APP_NAME}`}</h1>
            <div className="row">Content</div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
