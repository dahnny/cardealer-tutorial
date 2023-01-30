import slideImg1 from '../images/slide-img1.jpg';

const Header = props => {
    return (
        <>
            <header className="header-section">

                <div className="header-bottom">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg p-0">
                            <a className="site-logo site-title" href="index.html"><h2>CeloDealer</h2></a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span style={{ color: "black" }} className="menu-toggle" />
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav main-menu mr-auto">

                                    <li><a href="#">USD Balance: ${props.balance}CUSD |||| Celo Balance: ${props.celo}</a></li>

                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>{/* header-bottom end */}
            </header>
            <section className="banner-section bg_img" data-background={slideImg1}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-7">
                            <div className="banner-content">
                                <h1 className="title">Best Car Dealer</h1>
                                <p>We offer the best car service in the city. Dont miss out on this oppurtunity to be a car owner</p>
                                <a href="#0" className="cmn-btn">Sell/Rent your car</a>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="banner-img">
                                {/* <img src=alt="image" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>

    );
}

export default Header