package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"log"

	"net"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v4"
	"github.com/jasonlvhit/gocron"

	// "github.com/rs/cors"
	"github.com/go-chi/cors"

	"bufio"
)

const (
	connHost = "localhost"
	connPort = "8090"
	connType = "tcp"
)

//declare structure for JSON data received from frontend and sent by backend

type numbers struct {
	Num1 float64 `json:"num1"`
	Num2 float64 `json:"num2"`
}

type numsResponseData struct {
	Add float64 `json:"add"`
	Mul float64 `json:"mul"`
	Sub float64 `json:"sub"`
	Div float64 `json:"div"`
}

type greeting struct {
	Message string `json:"message"`
}

type square struct {
	Width     int8   `json:"width"`
	Height    int8   `json:"height"`
	Color     string `json:"color"`
	Positionx int8   `json:"positionx"`
	Positiony int8   `json:"positiony"`
	Speed     int8   `json:"speed"`
	Direction int8   `json:"direction"`
}

type user_score struct {
	Name  string `json:name`
	Score int8   `json:"score"`
}

//function to do the calculations
func process(numsdata numbers) numsResponseData {
	var numsres numsResponseData
	numsres.Add = numsdata.Num1 + numsdata.Num2
	numsres.Mul = numsdata.Num1 * numsdata.Num2
	numsres.Sub = numsdata.Num1 - numsdata.Num2
	numsres.Div = numsdata.Num1 / numsdata.Num2

	return numsres
}

//function which will be called when a POST request is sent to the backend to process the coming JSON data
func calc(w http.ResponseWriter, request *http.Request) {
	decoder := json.NewDecoder(request.Body)

	var numsData numbers
	var numsResData numsResponseData

	decoder.Decode(&numsData)

	numsResData = process(numsData)
	fmt.Println(numsResData)

	//build HTTP response
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(numsResData); err != nil {
		panic(err)
	}
}

func home(w http.ResponseWriter, request *http.Request) {
	// fmt.Println(quote.Go())
	var message greeting
	my_square := square{Width: 10, Height: 10, Color: "black", Positionx: 15, Positiony: 15, Speed: 10, Direction: 37}
	message.Message = "Hello from Go backend"
	fmt.Println(message)

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(my_square); err != nil {
		panic(err)
	}
}

func myTask() {
	fmt.Println("This task will run periodically")
}
func executeCronJob() {
	gocron.Every(10).Second().Do(myTask)
	<-gocron.Start()
}

func main() {
	// Socket initialization
	fmt.Println("Starting " + connType + " server on " + connHost + ":" + connPort)
	l, err := net.Listen(connType, connHost+":"+connPort)
	if err != nil {
		fmt.Println("Error listening:", err.Error())
		os.Exit(1)
	}
	defer l.Close()

	//accept client connections
	go acceptClientConn(l)

	//Connect to CockroachDB
	config, err := pgx.ParseConfig("postgresql://root@localhost:26257/game?sslmode=disable")
	if err != nil {
		log.Fatal("error configuring the database: ", err)
	}
	// config.TLSConfig.ServerName = "localhost"
	// Connect to the "user" database.

	conn, err := pgx.ConnectConfig(context.Background(), config)
	if err != nil {
		log.Fatal("error connecting to the database: ", err)
	}
	defer conn.Close(context.Background())

	// Create the "score" table.
	if _, err := conn.Exec(context.Background(),
		"CREATE TABLE IF NOT EXISTS score_board (name STRING NOT NULL, score INT);"); err != nil {
		log.Fatal(err)
	}

	// http.HandleFunc("/", calc)
	// var scores = []userboard{
	// 	userboard{Score: 100},
	// 	userboard{Score: 15},
	// }

	// go executeCronJob()
	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
	})
	r := chi.NewRouter()
	r.Use(middleware.Recoverer)
	r.Use(middleware.Logger)
	r.Use(cors.Handler)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("welcome"))
	})

	r.Get("/userScore", func(w http.ResponseWriter, r *http.Request) {
		// my_player := user_score{Name: "Karen", Score: 100}
		rows, _ := conn.Query(context.Background(), "SELECT * FROM score_board")
		// if err != nil {
		// 	http.Error(w, http.StatusText(500), 500)
		// }
		defer rows.Close()
		fmt.Println(rows)
		scores := make([]user_score, 0)
		for rows.Next() {

			score := user_score{}
			rows.Scan(&score.Name, &score.Score)
			// fmt.Println("%s %d\n", name_player, score_player)
			fmt.Println(score.Name)
			// if err != nil {
			// 	http.Error(w, http.StatusText(500), 500)
			// 	return
			// }
			scores = append(scores, score)
		}
		fmt.Println(scores)
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(scores); err != nil {
			panic(err)
		}
	})

	r.Post("/registerUserScore", func(w http.ResponseWriter, r *http.Request) {
		decoder := json.NewDecoder(r.Body)
		var player_score user_score

		decoder.Decode(&player_score)
		fmt.Println("Playername: ", player_score.Name)
		fmt.Println("Player's score: ", player_score.Score)
		//Insert one record
		if _, err := conn.Exec(context.Background(),
			`INSERT INTO score_board (name, score) VALUES ('`+player_score.Name+`',`+strconv.FormatInt(int64(player_score.Score), 10)+`);`); err != nil {
			log.Fatal(err)
		}

		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(map[string]string{"message": "score added"}); err != nil {
			panic(err)
		}

	})
	http.ListenAndServe(":3000", r)
}
func acceptClientConn(l net.Listener) {
	for {
		c, err := l.Accept()
		if err != nil {
			fmt.Println("Error connecting:", err.Error())
			return
		}
		fmt.Println("Client connected.")

		fmt.Println("Client " + c.RemoteAddr().String() + " connected.")
	}
}
func handleConnection(conn net.Conn) {
	buffer, err := bufio.NewReader(conn).ReadBytes('\n')

	if err != nil {
		fmt.Println("Client left.")
		conn.Close()
		return
	}

	log.Println("Client message:", string(buffer[:len(buffer)-1]))

	conn.Write(buffer)

	handleConnection(conn)
}

func setInterval(myFunc func(), milisenconds int, async bool) chan bool {
	interval := time.Duration(milisenconds) * time.Millisecond

	ticker := time.NewTicker(interval)
	clear := make(chan bool)

	go func() {
		for {
			select {
			case <-ticker.C:
				if async {
					go myFunc()
				} else {
					myFunc()
				}
			case <-clear:
				ticker.Stop()
				return
			}
		}
	}()
	return clear
}
