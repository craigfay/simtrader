# Commands
Run Docker Container: `docker run -it -e USER=$USER -v $(pwd):/app -w=/app rust:latest bash`
Build source: `cargo build`
Build source and run: `cargo run`
Run: `./target/debug/backend`
