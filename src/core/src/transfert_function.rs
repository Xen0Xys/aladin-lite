#[derive(Clone, Copy, Debug)]
pub enum TransferFunction {
    Linear = 0,
    Sqrt = 1,
    Log = 2,
    Asinh = 3,
    Pow2 = 4,
}

impl TransferFunction {
    pub fn new(id: &str) -> Self {
        if id.contains("linear") {
            TransferFunction::Linear
        } else if id.contains("pow2") {
            TransferFunction::Pow2
        } else if id.contains("log") {
            TransferFunction::Log
        } else if id.contains("sqrt") {
            TransferFunction::Sqrt
        } else {
            TransferFunction::Asinh
        }
    }
}

use al_core::{
    shader::{ShaderBound, SendUniforms}
};

impl SendUniforms for TransferFunction {
    fn attach_uniforms<'a>(&self, shader: &'a ShaderBound<'a>) -> &'a ShaderBound<'a> {
        shader.attach_uniform("H", self);

        shader
    }
}

impl From<String> for TransferFunction {
    fn from(id: String) -> Self {
        TransferFunction::new(&id)
    }
}
use web_sys::WebGlUniformLocation;
use al_core::{
    WebGl2Context,
    shader::UniformType
};
impl UniformType for TransferFunction {
    fn uniform(gl: &WebGl2Context, location: Option<&WebGlUniformLocation>, value: &Self) {
        gl.uniform1i(location, *value as i32);
    }
}