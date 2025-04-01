// Recreating Smertimba Graphics's Pixel Scan effect using VFX-JS
// https://www.youtube.com/watch?v=JFn2kK8GhUQ
import { VFX } from "https://esm.sh/@vfx-js/core@0.5.2";

const shader = `
precision highp float;
uniform sampler2D src;
uniform vec2 resolution;
uniform vec2 offset;
uniform float time;
uniform float enterTime;
uniform float leaveTime;

uniform int mode;
uniform float layers;
uniform float speed;
uniform float delay;
uniform float width;

#define W width
#define LAYERS layers

vec4 readTex(vec2 uv) {
  if (uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.) {
    return vec4(0);
  }
  return texture(src, uv);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(4859., 3985.))) * 3984.);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

/** Get distance from a box */
float sdBox(vec2 p, float r) {
  vec2 q = abs(p) - r;
  return min(length(q), max(q.y, q.x));
}


float dir = 1.;

/** Remap to animation range [0, 1] */
float toRangeT(vec2 p, float scale) {
  float d;
  
  if (mode == 0) {
    d = p.x / (scale * 2.) + .5; // Left-to-right
  }
  else if (mode == 1) {
    d = 1. - (p.y / (scale * 2.) + .5); // Top-to-bottom
  }
  else if (mode == 2) {
    d = length(p) / scale; // Radial
  }
  
  d = dir > 0. ? d : (1. - d);
    
  return d;
}

vec4 cell(vec2 p, vec2 pi, float scale, float t, float edge) {
  vec2 pc = pi + .5;

  // Get cell alpha
  vec2 uvc = pc / scale;
  uvc.y /= resolution.y / resolution.x;
  uvc = uvc * 0.5 + 0.5;
  if (uvc.x < 0. || uvc.x > 1. || uvc.y < 0. || uvc.y > 1.) {
    return vec4(0);
  }
  float alpha = smoothstep(.0, .1, texture2D(src, uvc, 3.).a);
    
  // Get random color for cell
  vec4 color = vec4(hsv2rgb(vec3((pc.x * 13. / pc.y * 17.) * 0.3, 1, 1)), 1);
  
  // Fade the color by animation    
  float x = toRangeT(pi, scale);
  float n = hash(pi);
  float anim = smoothstep(W * 2., .0, abs(x + n * W - t));
  color *= anim;    
    
  // Add edge light
  color *= mix(
    1., 
    clamp(.3 / abs(sdBox(p - pc, .5)), 0., 10.),
    edge * pow(anim, 10.)
  ); 
  
  return color * alpha;
}

vec4 cellsColor(vec2 p, float scale, float t) {
  vec2 pi = floor(p);
  vec2 pf = fract(p);
  
  float l = 0.;
  vec2 pc;
 
  vec2 d = vec2(0, 1);

  vec4 cc = vec4(0);
  cc += cell(p, pi, scale, t, .2) * 4.;
  cc += cell(p, pi + d.xy, scale, t, .9);
  cc += cell(p, pi - d.xy, scale, t, .9);
  cc += cell(p, pi + d.yx, scale, t, .9);
  cc += cell(p, pi - d.yx, scale, t, .9);
   
  return cc / 8.;
}

vec4 draw(vec2 uv, vec2 p, float t, float scale) {
  vec4 c = readTex(uv);

  // Create cells
  vec2 pi = floor(p * scale);
  vec2 pf = fract(p * scale);

  // Get alpha
  float n = hash(pi);
  t = t * (1. + W * 4.) - W * 2.; // remap to [-2W, 1. + 2W]
    
  float x = toRangeT(pi, scale);
  float a1 = smoothstep(t, t - W, x + n * W);    
  c *= a1;

  // Get cell color;  
  c += cellsColor(p * scale, scale, t) * 1.5;
  
  return c;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - offset) / resolution;
  vec2 p = uv * 2. - 1.;
  p.y *= resolution.y / resolution.x;

  float t;
  
  if (leaveTime > 0.) {
    dir = -1.;
    t = clamp(leaveTime * speed, 0., 1.);
  } else {
    t = clamp((enterTime - delay) * speed, 0., 1.);  
  }      
  // Flip t by dir
  t = (fract(t * .99999) - 0.5) * dir + 0.5;      
    
  for (float i = 0.; i < LAYERS; i++) {
    float s = cos(i) * 7.3 + 10.; 
    gl_FragColor += draw(uv, p, t, abs(s));
  }
  gl_FragColor /= LAYERS;  
  
  gl_FragColor *= smoothstep(0., 0.01, t);
}
`;

// util
const getDataAttributes = (e) => {
  return Object.entries(e.attributes).reduce((acc, [_,d]) => {
    if (d.name.match(/^data-(.*)$/) && d.value != null) {
      acc[RegExp.$1] = parseFloat(d.value);
    }
    return acc;
  }, {}); 
};

// main
const vfx = new VFX();

for (const e of document.querySelectorAll('.anim-text,h2')) {      
  const data = getDataAttributes(e);
      
  vfx.add(e, { 
    shader, 
    overflow: 30, 
    intersection: { threshold: 0.99 },
    uniforms: {      
      
      // Animation mode.
      // - 0: left-to-right
      // - 1: top-to-bottom
      // - 2: radial       
      mode: data.mode ?? 0,
      
      // Width of effect area.
      width: data.width ?? 0.2,
      
      // Number of pixel layers.
      layers: data.layers ?? 10,
            
      speed: data.speed ?? 0.75, 
      delay: data.delay ?? 0,      
      
    }
  });  
}
