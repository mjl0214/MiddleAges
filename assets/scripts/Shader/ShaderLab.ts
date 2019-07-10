
const MVP = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
    vec4 pos = viewProj * vec4(a_position, 1);
    gl_Position = pos;
    uv0 = a_uv0;
}`;

const ShaderLab = {
    GrayScaling: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gray = dot(c.rgb, vec3(0.299 * 0.5, 0.587 * 0.5, 0.114 * 0.5));
    gl_FragColor = vec4(gray, gray, gray, c.a * 0.5);
}
`
    },
    Stone: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float clrbright = (c.r + c.g + c.b) * (1. / 3.);
    float gray = (0.6) * clrbright;
    gl_FragColor = vec4(gray, gray, gray, c.a);
}
`
    },
    Ice: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 clrx = color * texture2D(texture, uv0);
    float brightness = (clrx.r + clrx.g + clrx.b) * (1. / 3.);
	float gray = (1.5)*brightness;
	clrx = vec4(gray, gray, gray, clrx.a)*vec4(0.8,1.2,1.5,1);
    gl_FragColor =clrx;
}
`
    },
    Frozen: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c *= vec4(0.8, 1, 0.8, 1);
	c.b += c.a * 0.2;
    gl_FragColor = c;
}
`
    },
    Mirror: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c.r *= 0.5;
    c.g *= 0.8;
    c.b += c.a * 0.2;
    gl_FragColor = c;
}
`
    },
    Poison: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    c.r *= 0.8;
	c.r += 0.08 * c.a;
	c.g *= 0.8;
    c.g += 0.2 * c.a;
	c.b *= 0.8;
    gl_FragColor = c;
}
`
    },
    Banish: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gg = (c.r + c.g + c.b) * (1.0 / 3.0);
    c.r = gg * 0.9;
    c.g = gg * 1.2;
    c.b = gg * 0.8;
    c.a *= (gg + 0.1);
    gl_FragColor = c;
}
`
    },
    Vanish: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
void main () {
    vec4 c = color * texture2D(texture, uv0);
    float gray = (c.r + c.g + c.b) * (1. / 3.);
    float rgb = gray * 0.8;
    gl_FragColor = vec4(rgb, rgb, rgb, c.a * (gray + 0.1));
}
`
    },
    Invisible: {
        vert: MVP,
        frag: 
`
void main () {
    gl_FragColor = vec4(0,0,0,0);
}
`
    },
    Blur: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
uniform float num;
varying vec2 uv0;
void main () {
    vec4 sum = vec4(0.0);
    vec2 size = vec2(num,num);
    sum += texture2D(texture, uv0 - 0.4 * size) * 0.05;
	sum += texture2D(texture, uv0 - 0.3 * size) * 0.09;
	sum += texture2D(texture, uv0 - 0.2 * size) * 0.12;
	sum += texture2D(texture, uv0 - 0.1 * size) * 0.15;
	sum += texture2D(texture, uv0             ) * 0.16;
	sum += texture2D(texture, uv0 + 0.1 * size) * 0.15;
	sum += texture2D(texture, uv0 + 0.2 * size) * 0.12;
	sum += texture2D(texture, uv0 + 0.3 * size) * 0.09;
    sum += texture2D(texture, uv0 + 0.4 * size) * 0.05;
    
    vec4 vectemp = vec4(0,0,0,0);
    vec4 substract = vec4(0,0,0,0);
    vectemp = (sum - substract) * color;

    float alpha = texture2D(texture, uv0).a;
    if(alpha < 0.05) { gl_FragColor = vec4(0 , 0 , 0 , 0); }
	else { gl_FragColor = vectemp; }
}
`
    },
    GaussBlur: {
        vert: MVP,
        frag: 
`
#define repeats 5.
uniform sampler2D texture;
uniform vec4 color;
uniform float num;
varying vec2 uv0;

vec4 draw(vec2 uv) {
    return color * texture2D(texture,uv).rgba; 
}
float grid(float var, float size) {
    return floor(var*size)/size;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main()
{
    vec4 blurred_image = vec4(0.);
    for (float i = 0.; i < repeats; i++) { 
        vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i,uv0.x+uv0.y))+num); 
        vec2 uv2 = uv0+(q*num);
        blurred_image += draw(uv2)/2.;
        q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) * (rand(vec2(i+2.,uv0.x+uv0.y+24.))+num); 
        uv2 = uv0+(q*num);
        blurred_image += draw(uv2)/2.;
    }
    blurred_image /= repeats;
    gl_FragColor = vec4(blurred_image);
}
`
    },
    Dissolve: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    vec4 c = color * texture2D(texture,uv0);
    float height = c.r;
    if(height < time)
    {
        discard;
    }
    if(height < time+0.04)
    {
        // 溶解颜色，可以自定义
        c = vec4(.9,.6,0.3,c.a);
    }
    gl_FragColor = c;
}
`
    },
    Fluxay: {
        vert: MVP,
        frag: 
`
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    vec4 src_color = color * texture2D(texture, uv0).rgba;

    float width = 0.08;       //流光的宽度范围 (调整该值改变流光的宽度)
    float start = tan(time/1.414);  //流光的起始x坐标
    float strength = 0.008;   //流光增亮强度   (调整该值改变流光的增亮强度)
    float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
    if(uv0.x < (start - offset * uv0.y) &&  uv0.x > (start - offset * uv0.y - width))
    {
        vec3 improve = strength * vec3(255, 255, 255);
        vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
        gl_FragColor = vec4(result, src_color.a);

    }else{
        gl_FragColor = src_color;
    }
}
`
    },
    FluxaySuper: {
        vert: MVP,
        frag: 
`
#define TAU 6.12
#define MAX_ITER 5
uniform sampler2D texture;
uniform vec4 color;
uniform float time;
varying vec2 uv0;

void main()
{
    float time = time * .5+5.;
    // uv should be the 0-1 uv of texture...
    vec2 uv = uv0.xy;//fragCoord.xy / iResolution.xy;
    
    vec2 p = mod(uv*TAU, TAU)-250.0;

    vec2 i = vec2(p);
    float c = 1.0;
    float inten = .0045;

    for (int n = 0; n < MAX_ITER; n++) 
    {
        float t =  time * (1.0 - (3.5 / float(n+1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(1.5*t + i.x));
        c += 1.0/length(vec2(p.x / (cos(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
    }
    c /= float(MAX_ITER);
    c = 1.17-pow(c, 1.4);
    vec4 tex = texture2D(texture,uv);
    vec3 colour = vec3(pow(abs(c), 20.0));
    colour = clamp(colour + vec3(0.0, 0.0, .0), 0.0, tex.a);

    // 混合波光
    float alpha = c*tex[3];  
    tex[0] = tex[0] + colour[0]*alpha; 
    tex[1] = tex[1] + colour[1]*alpha; 
    tex[2] = tex[2] + colour[2]*alpha; 
    gl_FragColor = color * tex;
}
`
    },

    Outline: {
        vert:MVP,
        frag: 
`
#define radius 0.005
#define u_threshold 1.0

uniform sampler2D texture;
uniform vec4 color;
uniform float params[3];
varying vec2 uv0;

void main () {
    vec4 accum = vec4(0.0);
    vec4 normal = vec4(0.0);

    vec3 outlinecolor = vec3(params[0], params[1], params[2]);
    
    normal = texture2D(texture, uv0);
    
    accum += texture2D(texture, vec2(uv0.x - radius, uv0.y - radius));
    accum += texture2D(texture, vec2(uv0.x + radius, uv0.y - radius));
    accum += texture2D(texture, vec2(uv0.x + radius, uv0.y + radius));
    accum += texture2D(texture, vec2(uv0.x - radius, uv0.y + radius));
    
    accum *= u_threshold;
    accum.rgb =  outlinecolor * accum.a;
    // accum.a = 1.0;
    
    normal = ( accum * (1.0 - normal.a)) + (normal * normal.a);
    
    // vec4 c = color * texture2D(texture,uv0);
    gl_FragColor = color * normal;
}

`
    },

    Emboss: {
        vert:MVP,
        frag:
`
#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
const vec2 texOffset = vec2(0.005, 0.005);
const vec4 lumcoeff = vec4(0.299, 0.587, 0.114, 0);

void main()
{
    vec2 tc0 = uv0.st + vec2(-texOffset.s, -texOffset.t);
    vec2 tc1 = uv0.st + vec2(         0.0, -texOffset.t);
    vec2 tc2 = uv0.st + vec2(-texOffset.s,          0.0);
    vec2 tc3 = uv0.st + vec2( texOffset.s,          0.0);
    vec2 tc4 = uv0.st + vec2(         0.0, -texOffset.t);
    vec2 tc5 = uv0.st + vec2( texOffset.s,  texOffset.t);

    vec4 col0 = texture2D(texture, tc0);
    vec4 col1 = texture2D(texture, tc1);
    vec4 col2 = texture2D(texture, tc2);
    vec4 col3 = texture2D(texture, tc3);
    vec4 col4 = texture2D(texture, tc4);
    vec4 col5 = texture2D(texture, tc5);

    vec4 sum = vec4(0.5) + (col0 + col1 + col2) - (col3 + col4 + col5);
    float lum = dot(sum, lumcoeff);
    gl_FragColor = vec4(lum, lum, lum, 1.0) * color;
    vec4 c = color * texture2D(texture,uv0);
    gl_FragColor.a = c.a;
}
`
    },

    Saturation: {
        vert:MVP,
        frag:
`
precision mediump float;
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
const vec3 W = vec3(0.2125, 0.7154, 0.0721);

void main()
{
    vec4 c = color * texture2D(texture,uv0);
    float T = 3.0;
    vec2 st = uv0.st;
    vec3 irgb = texture2D(texture, st).rgb;
    float luminance = dot(irgb, W);
    vec3 target = vec3(luminance, luminance, luminance);
    gl_FragColor = vec4(mix(target, irgb, T), c.a);
}
`
    },

    Brightness:{
        vert:MVP,
        frag:
`
precision mediump float;
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

void main()
{
    vec4 c = color * texture2D(texture,uv0);
    float T = 2.0;
    vec2 st = uv0.st;
    vec3 irgb = texture2D(texture, st).rgb;
    vec3 black = vec3(0., 0., 0.);
    gl_FragColor = vec4(mix(black, irgb, T), c.a);
}
`       
    },

    Negative:{
        vert:MVP,
        frag:
`
precision mediump float;
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

void main()
{
    vec4 c = color * texture2D(texture,uv0);
    float T = 1.0;
    vec2 st = uv0.st;
    vec3 irgb = texture2D(texture, st).rgb;
    vec3 neg = vec3(1., 1., 1.) - irgb;
    gl_FragColor = vec4(mix(irgb, neg, T), c.a);
}
`   
    },

    Pencil:{
        vert:MVP,
        frag:
`
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

uniform vec2 size;

float lookup(vec2 p, float dx, float dy)
{
    vec2 uv = p.xy + vec2(dx , dy) / size.xy;
    vec4 c = texture2D(texture, uv.xy);
    return 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
}

void main()
{
    vec2 p = uv0.xy;
    // simple sobel edge detection
    float gx = 0.0;
    gx += -1.0 * lookup(p, -1.0, -1.0);
    gx += -2.0 * lookup(p, -1.0,  0.0);
    gx += -1.0 * lookup(p, -1.0,  1.0);
    gx +=  1.0 * lookup(p,  1.0, -1.0);
    gx +=  2.0 * lookup(p,  1.0,  0.0);
    gx +=  1.0 * lookup(p,  1.0,  1.0);
    
    float gy = 0.0;
    gy += -1.0 * lookup(p, -1.0, -1.0);
    gy += -2.0 * lookup(p,  0.0, -1.0);
    gy += -1.0 * lookup(p,  1.0, -1.0);
    gy +=  1.0 * lookup(p, -1.0,  1.0);
    gy +=  2.0 * lookup(p,  0.0,  1.0);
    gy +=  1.0 * lookup(p,  1.0,  1.0);
    
    float g = gx*gx + gy*gy;
    
    gl_FragColor.xyz = vec3(1.-g);
    gl_FragColor.w = 1.;
}
`  
    },

    Mosaic:
    {
        vert:MVP,
        frag:
`
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

void main()
{
    vec2 resolution = vec2(100., 100.);
    vec4 col = texture2D(texture, uv0);
    float x = uv0.x * resolution.x;
    float y = uv0.y * resolution.y;
    float realX = floor(x) / resolution.x;
    float realY = floor(y) / resolution.y;
    gl_FragColor = texture2D(texture, vec2(realX, realY) );
}
` 
    },

    OldPhoto:
    {
        vert:MVP,
        frag:
`
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

void main()
{
    vec2 resolution = vec2(100., 100.);
    vec4 col = texture2D(texture, uv0);
    vec4 col1 = vec4(0.393*col.r + 0.769*col.g + 0.189*col.b,
        0.349*col.r + 0.686*col.g + 0.168*col.b,
        0.272*col.r + 0.534*col.g + 0.131*col.b,
        col.a);
    gl_FragColor = col1;
}
` 
    },

    SobelEdge:
    {
        vert:MVP,
        frag:
`
precision mediump float;

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

uniform vec2 size;

void main()
{
    float step = 1.;
    vec2 UVOffset[25];
    float xInc = step / (size.x);
	float yInc = step / (size.y);

	for (int i = 0; i < 5; i++)
	{
		for (int j = 0; j < 5; j++)
		{
            UVOffset[(i * 5) + j] = vec2(-2. * xInc + float(i) * xInc, -2. * yInc + float(j) * yInc);
		}
	}

    vec4 sample[25];
    
    for(int k = 0; k < 25; k++)
    {
        sample[k] = texture2D(texture, uv0.st + UVOffset[k]);
    }

    vec4 vertEdge = sample[0] + 4.0 * sample[1] +
        6.0 * sample[2] + 4.0 * sample[3] + sample[4] +
        2.0 * sample[5] + 8.0 * sample[6] + 12.0 * sample[7] +
		8.0 * sample[8] + 2.0 * sample[9] - 2.0 * sample[15] -
		8.0 * sample[16] - 12.0 * sample[17] - 8.0 * sample[18] -
		2.0 * sample[19] - sample[20] - 4.0 * sample[21] -
		6.0 * sample[22] - 4.0 * sample[23] - sample[24];
    
    vec4 horizEdge = - sample[0] - 2.0 * sample[1] +
		2.0 * sample[3] + sample[4] - 4.0 * sample[5] - 
		8.0 * sample[6] + 8.0 * sample[8] + 4.0 * sample[9] -
		6.0 * sample[10] - 12.0 * sample[11] + 12.0 * sample[13] +
		6.0 * sample[14] - 4.0 * sample[15] - 8.0 * sample[16] +
		8.0 * sample[18] + 4.0 * sample[19] - sample[20] -
		2.0 * sample[21] + 2.0 * sample[23] + sample[24];

		//gl_FragColor.rgb = sqrt(horizEdge.rgb) + sqrt(vertEdge.rgb);
		gl_FragColor.rgb = sqrt((horizEdge.rgb * horizEdge.rgb) + 
            (vertEdge.rgb * vertEdge.rgb)) / 12.;
            
    vec4 c = color * texture2D(texture,uv0);
	gl_FragColor.a = c.a;
}
` 
    },

    Toon:
    {
        vert:MVP,
        frag:
`
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

uniform vec2 size;

#define FILTER_SIZE 2
#define COLOR_LEVELS 7.0
#define EDGE_FILTER_SIZE 2
#define EDGE_THRESHOLD 0.05

vec4 edgeFilter(in int px, in int py)
{
    vec4 color = vec4(0.0);
    for (int y = -EDGE_FILTER_SIZE; y <= EDGE_FILTER_SIZE; ++y)
    {
        for (int x = -EDGE_FILTER_SIZE; x <= EDGE_FILTER_SIZE; ++x)
        {
            color += texture2D(texture, uv0 + vec2(px + x, py + y) / size.xy);
        }
    }

    color /= float((2 * EDGE_FILTER_SIZE +1) * (2 * EDGE_FILTER_SIZE +1));

    return color;

}

void main()
{
    // Shade
    // resolution=vec2(1024.0,768.0);
    vec4 color =vec4(0.0);
    for (int y = -FILTER_SIZE; y <= FILTER_SIZE; ++y)
    {
        for (int x = -FILTER_SIZE; x <= FILTER_SIZE; ++x)
        {
            color +=texture2D(texture, uv0 +vec2(x, y) / size.xy);   
        }
    }

    color /= float((2 * FILTER_SIZE +1) * (2 * FILTER_SIZE +1));
    
    for (int c =0; c <3; ++c)
    {
        color[c] =floor(COLOR_LEVELS * color[c]) / COLOR_LEVELS;
    }

    // Highlight edges
    vec4 sum =abs(edgeFilter(0,1) - edgeFilter(0,-1));
    sum += abs(edgeFilter(1,0) - edgeFilter(-1,0));
    sum /= 2.0;
    if (length(sum) > EDGE_THRESHOLD)
    {
        color.rgb =vec3(0.0);
    }

    gl_FragColor = color;

}
`
    },

    Sharpen:
    {
        vert:MVP,
        frag:
`
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;

uniform vec2 size;

float lookup(vec2 p, float dx, float dy)
{
    vec2 uv = p.xy + vec2(dx , dy ) / size.xy;
    vec4 c = texture2D(texture, uv.xy);
    return 0.2126*c.r + 0.7152*c.g + 0.0722*c.b;
}

void main()
{
    float step = 1.;
    vec2 UVOffset[25];
    float xInc = step / (size.x);
	float yInc = step / (size.y);

	for (int i = 0; i < 5; i++)
	{
		for (int j = 0; j < 5; j++)
		{
            UVOffset[(i * 5) + j] = vec2(-2. * xInc + float(i) * xInc, -2. * yInc + float(j) * yInc);
		}
	}

    vec4 sample[25];
    
    for(int k = 0; k < 25; k++)
    {
        sample[k] = texture2D(texture, uv0.st + UVOffset[k]);
    }
    
    gl_FragColor = -14.0 * sample[12];
	for (int i = 0; i < 25; i++)												
	{																			
		if (i != 12)																
		gl_FragColor += sample[i];													
	}																	
	gl_FragColor /= 14.0;
}
`
    },

    OilPaint:{
        vert:MVP,
        frag:
`
#define _ResolutionValue 1.0
#define _Radius 10

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
uniform vec2 size;

void main()
{
    vec2 src_size = vec2(_ResolutionValue / size.x,_ResolutionValue / size.y);
    // vec2 uv = i.uv;
	float n = (float(_Radius) + 1.)*(float(_Radius) + 1.);
    vec3 m0 = vec3(0.);
    vec3 m1 = vec3(0.);
    vec3 m2 = vec3(0.);
    vec3 m3 = vec3(0.);

    vec3 s0 = vec3(0.);
    vec3 s1 = vec3(0.);
    vec3 s2 = vec3(0.);
    vec3 s3 = vec3(0.);

    vec3 color = vec3(0.);
	for (int j = -_Radius;j <= 0;++j) {
		for (int k = -_Radius;k <= 0; ++k) {
			color = texture2D(texture, uv0 + vec2(k, j)*src_size).rgb;
			m0 += color;
			s0 += color * color;
		}
	}
	for (int j = -_Radius;j <= 0; ++j) {
		for (int k = 0;k <= _Radius; ++k) {
			color = texture2D(texture, uv0 + vec2(k, j)*src_size).rgb;
			m1 += color;
			s1 += color * color;
		}
    }
    for (int j = 0;j <= _Radius; ++j) {
		for (int k = 0;k <= _Radius; ++k) {
			color = texture2D(texture, uv0 + vec2(k, j)*src_size).rgb;
			m2 += color;
			s2 += color * color;
		}
    }
    for (int j = 0;j <= _Radius; ++j) {
		for (int k = -_Radius;k <= 0; ++k) {
			color = texture2D(texture, uv0 + vec2(k, j)*src_size).rgb;
			m3 += color;
			s3 += color * color;
		}
	}
	vec4 finalColor = vec4(0.0);
    float min_sigma2 = 100.;
    
	m0 /= n;
	s0 = abs(s0 / n - m0 * m0);
	float sigma2 = s0.r + s0.g + s0.b;
	if (sigma2 < min_sigma2) 
	{
		min_sigma2 = sigma2;
		finalColor = vec4(m0, 1.0);
    }
    
	m1 /= n;
	s1 = abs(s1 / n - m1 * m1);
	sigma2 = s1.r + s1.g + s1.b;
	if (sigma2 < min_sigma2) 
	{
		min_sigma2 = sigma2;
		finalColor = vec4(m1, 1.0);
    }

    m2 /= n;
	s2 = abs(s2 / n - m2 * m2);
	sigma2 = s2.r + s2.g + s2.b;
	if (sigma2 < min_sigma2) 
	{
		min_sigma2 = sigma2;
		finalColor = vec4(m2, 1.0);
    }

    m3 /= n;
	s3 = abs(s3 / n - m3 * m3);
	sigma2 = s3.r + s3.g + s3.b;
	if (sigma2 < min_sigma2) 
	{
		min_sigma2 = sigma2;
		finalColor = vec4(m3, 1.0);
    }
    
    gl_FragColor = finalColor;
}
` 
    },

    Mat3Filter:
    {
        vert:MVP,
        frag:
`
precision mediump float;
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
uniform vec2 size;

uniform float params[11];

vec4 getColor()
{
    vec2 UVOffset[9];
    float xInc = 1. / (size.x);
	float yInc = 1. / (size.y);

	for (int i = 0; i < 3; i++)
	{
		for (int j = 0; j < 3; j++)
		{
            UVOffset[(i * 3) + j] = vec2(-1. * xInc + float(i) * xInc, -1. * yInc + float(j) * yInc);
		}
	}

    vec4 sample[9];
    
    for(int k = 0; k < 9; k++)
    {
        sample[k] = texture2D(texture, uv0.st + UVOffset[k]);
    }

    vec4 col;
    for(int k = 0; k < 9; k++)
    {
        col += params[k] * sample[k];
    }

    // params[9] 均值 , params[10] 偏移量
    float sum = params[9];
    if (sum == 0.)
    {
        sum = 1.;
    }
    vec4 c = color * texture2D(texture, uv0);
    col = col / abs(sum);
    col.r += params[10] / 256.;
    col.g += params[10] / 256.;
    col.b += params[10] / 256.;
    col.a = c.a;

    return col;
}

void main()
{
    gl_FragColor = getColor();
}

`
    },

    CyberPunk:
    {
        vert:MVP,
        frag:
`
#define PI 3.14159

uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
uniform vec2 size;

vec2 deformUv(vec2 uv) 
{
	float yMul = 0.92 - 0.08 * sin(uv.x * PI);
            
    if(uv.y >= 0.5)
    {
    	return vec2(uv.x, yMul*(uv.y-0.5)+0.5 );
    }
    else
    {
    	return vec2(uv.x, 0.5+yMul*(uv.y-0.5));
    }
}

float edgeIntensity(vec2 uv)
{
	float edgeIntensityX = 1.0;
    if( uv.x < 0.1)
    {
    	edgeIntensityX = 0.7 + 0.3*(uv.x/0.1);
    }
    else if( uv.x > 0.90)   
    {
    	edgeIntensityX = 0.7 + 0.3*((1.0-uv.x)/0.1);
    }
        
    float edgeIntensityY = 1.0;
    if( uv.y < 0.15)
    {
    	edgeIntensityY = 0.6 + 0.4*(uv.y/0.15);
    }
    else if( uv.y > 0.85)   
    {
    	edgeIntensityY = 0.6 + 0.4*((1.0-uv.y)/0.15);
    }        
    return edgeIntensityX*edgeIntensityY;
}

void main()
{
    // Deform like old CRT, bulge in the middle
    vec2 uv = deformUv(uv0);
	
    // Take multiple samples to displace different color channels
    vec4 sample1 = texture2D(texture, vec2(uv.x-0.002,uv.y-0.001));
	vec4 sample2 = texture2D(texture, uv);
	vec4 sample3 = texture2D(texture, vec2(uv.x+0.002,uv.y+0.001));                           
	vec4 color = vec4(0.5*sample1.r+0.5*sample2.r, 
                      0.25*sample1.g+0.5*sample2.g+0.25*sample3.g, 
                      0.5*sample2.b+0.5*sample3.b, 
                      1.);
    
    // Fade around the edges        
    color.rgb *= edgeIntensity(uv);
        
    gl_FragColor = color;
}

`
    },

    White:{
        vert:MVP,
        frag:
`
precision mediump float;
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
uniform vec2 size;

void main()
{
    vec4 c = color * texture2D(texture,uv0);
    gl_FragColor = vec4(255, 255, 255, c.a);
}
` 
    },

    TestEx:{
        vert:MVP,
        frag:
`
precision mediump float;
uniform sampler2D texture;
uniform vec4 color;
varying vec2 uv0;
uniform vec2 size;

vec4 getColor()
{
    vec2 UVOffset[9];
    float xInc = 1. / (size.x);
	float yInc = 1. / (size.y);

	for (int i = 0; i < 3; i++)
	{
		for (int j = 0; j < 3; j++)
		{
            UVOffset[(i * 3) + j] = vec2(-2. * xInc + float(i) * xInc, -2. * yInc + float(j) * yInc);
		}
	}

    vec4 sample[9];
    
    for(int k = 0; k < 9; k++)
    {
        sample[k] = texture2D(texture, uv0.st + UVOffset[k]);
    }

    //
    float kernel[9];
    kernel[0] = -1.;
    kernel[1] = -1.;
    kernel[2] = -1.;
    kernel[3] = -1.;
    kernel[4] = 9.;
    kernel[5] = -1.;
    kernel[6] = -1.;
    kernel[7] = -1.;
    kernel[8] = -1.;

    vec4 col;
    float sum;
    for(int k = 0; k < 9; k++)
    {
        col += kernel[k] * sample[k];
        sum += kernel[k];
    }

    vec4 c = color * texture2D(texture, uv0);
    return col / sum;
}

void main()
{

    vec4 c = color * texture2D(texture,uv0);
    // float gray = 0.3 * c.r + 0.3 * c.g + 0.3 * c.b;
    // gray = 1.0 - abs(gray);
    // gl_FragColor = getColor();
    gl_FragColor = vec4(255, 255, 255, c.a);
}
` 
    },

};

export default ShaderLab;
