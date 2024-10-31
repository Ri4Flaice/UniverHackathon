import React from "react";
import '../Main.css';

const Main = () => {
    const events = [
        { title: "Фестиваль Культуры", description: "Погрузитесь в традиции и обычаи нашего города" },
        { title: "Спортивный марафон", description: "Примите участие в забеге и испытайте свои силы" },
        { title: "Ночь музеев", description: "Посетите музеи города в необычное время" },
        { title: "Выставка Искусств", description: "Познакомьтесь с произведениями местных художников" },
    ];

    return (
        <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header */}
                <header style={{
                    backgroundImage: "url(https://happylove.top/uploads/posts/2023-06/1687427634_happylove-top-p-petropavlovsk-kazakhstan-dostoprimechateln-1.jpg)",
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                    color: "#fff",
                    padding: "80px 20px",
                    marginBottom: '10px',
                    textAlign: "center",
                    borderRadius: '20px'
                }}>
                    <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>Мой Петропавловск</h1>
                    <h2 style={{ fontSize: "2rem", fontStyle: "italic", marginBottom: "20px" }}>Путешествуйте по родному городу</h2>

                    {/* Кнопки */}
                    <div style={{ marginTop: "20px", display: "flex", gap: "15px", justifyContent: "center" }}>
                        <button style={{
                            backgroundColor: "#2A9D8F",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}>На карту</button>

                        <button style={{
                            backgroundColor: "#e76f51",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}>Служба экстренной помощи</button>
                    </div>
                </header>

                {/* Важные события */}
                <section style={{
                    padding: "40px 20px",
                    backgroundColor: "#2A2A2A",
                    marginBottom: "10px",
                    borderRadius: '20px'
                }}>
                    <h2 style={{ color: "#fff", textAlign: "center", marginBottom: "30px", fontSize: "1.8rem" }}>Важные события</h2>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                    }}>
                        {events.map((event, index) => (
                            <div key={index} style={{
                                width: "220px",
                                textAlign: "center",
                                backgroundColor: "#f4a261",
                                padding: "20px",
                                borderRadius: "15px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                color: "#333",
                            }}>
                                <h3 style={{
                                    fontSize: "1.4rem",
                                    fontWeight: "bold",
                                    color: "#fff",
                                    marginBottom: "10px",
                                }}>{event.title.toUpperCase()}</h3>
                                <p style={{
                                    fontSize: "0.9rem",
                                    color: "#fff",
                                    marginBottom: "20px",
                                    lineHeight: "1.5",
                                }}>{event.description}</p>
                                <a href="#" style={{
                                    color: "#2A9D8F",
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                    textDecoration: "none",
                                }}>Узнать больше</a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* О городе */}
                <section style={{
                    padding: "50px 20px",
                    textAlign: "center",
                    backgroundColor: "#264653",
                    color: "#fff",
                    marginBottom: "10px",
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}>
                    <img src="https://via.placeholder.com/300" alt="О нас" style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        marginRight: "20px", // добавлено для отступа между изображением и текстом
                    }} />
                    <div style={{ textAlign: "left" }}> {/* Добавлено обернуть текст в div для выравнивания */}
                        <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>Наш город - наш дом</h2>
                        <p style={{ fontSize: "1rem", marginBottom: "20px" }}>Петропавловск - город с богатой историей и культурой. Здесь каждый может найти что-то по душе.</p>
                        <button style={{
                            backgroundColor: "#e76f51",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}>Подробнее</button>
                    </div>
                </section>


                {/* Активный отдых */}
                <section style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    backgroundColor: "#2A2A2A",
                    borderRadius: '20px'
                }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "10px", color: '#fff' }}>Активный отдых</h2>
                    <p style={{ fontSize: "1rem", marginBottom: "30px", color: '#fff' }}>Множество возможностей для активного отдыха на природе.</p>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "10px",
                        justifyItems: "center",
                    }}>
                        {Array(6).fill("https://via.placeholder.com/200").map((src, index) => (
                            <img key={index} src={src} alt={`Отдых ${index + 1}`} style={{
                                width: "100%",
                                maxWidth: "200px",
                                height: "150px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            }} />
                        ))}
                    </div>
                    <button style={{
                        backgroundColor: "#e76f51",
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}>Больше фото</button>
                </section>
            </div>
        </div>
    );
};

export default Main;
