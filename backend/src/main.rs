extern crate reqwest;

use std::fs::read_to_string;
use std::io::Read;
use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let api_url = read_to_string("src/api_url.secret")?;
    println!("{:?}", api_url);

    let mut res = reqwest::get(&api_url)?;
    let mut body = String::new();
    res.read_to_string(&mut body)?;

    println!("Status: {}", res.status());
    println!("Headers:\n{:#?}", res.headers());
    println!("Body:\n{}", body);

    Ok(())
}