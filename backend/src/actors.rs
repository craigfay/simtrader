#[derive(Debug)]
pub struct Actor<'a> {
    pub name: &'a str,
    pub cash: f32,
    pub positions: Vec<&'a str>
}
