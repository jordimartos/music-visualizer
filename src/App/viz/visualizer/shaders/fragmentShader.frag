varying vec3 vPos;
varying float vFrequency;
uniform float uTime;

const float PI = 3.14159265359;

const vec3 hemiLight_g_1=vec3(229/255,0,97/255);
const vec3 hemiLight_s_1=vec3(239/255,203/255,3/255);
const vec3 hemiLight_g_2=vec3(162/255,11/255,121/255);
const vec3 hemiLight_s_2=vec3(162/255,11/255,36/255);

const vec3 dirLight=vec3(.2);
const vec3 dirLight_2=vec3(.15);

const vec3 hemiLightPos_1=vec3(1.,0.,-1.);
const vec3 hemiLightPos_2=vec3(-.5,.5,1.);

const vec3 dirLightPos=vec3(-30,50,50);
const vec3 dirLightPos_2=vec3(30,-50,-50);

vec3 adjustByFrequency(){
  return vec3(vFrequency*.1,vFrequency*.1,vFrequency*.5)*.08;
}

vec3 adjustByPos(){
  float offset=min(0.,(vPos.x*sin(uTime)+vPos.y*cos(uTime))/100.);
  return-vec3(offset)*vec3(-.3,.5,1.2);
}

vec3 calcIrradiance_hemi(vec3 newNormal,vec3 lightPos,vec3 grd,vec3 sky){
  float dotNL=dot(newNormal,normalize(lightPos));
  float hemiDiffuseWeight=.5*dotNL+.5;
  
  return mix(grd,sky,hemiDiffuseWeight);
}

vec3 calcIrradiance_dir(vec3 newNormal,vec3 lightPos,vec3 light){
  float dotNL=dot(newNormal,normalize(lightPos));
  return light*max(0.,dotNL);
}

vec3 calcHemiColor(vec3 _normal){
  vec3 hemiColor=vec3(0.);
  hemiColor+=calcIrradiance_hemi(_normal,hemiLightPos_1,hemiLight_g_1,hemiLight_s_1)*.7;
  hemiColor+=calcIrradiance_hemi(_normal,hemiLightPos_2,hemiLight_g_2,hemiLight_s_2)*.8;
  return hemiColor;
}

vec3 calcDirColor(vec3 _normal){
  vec3 dirColor=vec3(0.);
  dirColor+=calcIrradiance_dir(_normal,dirLightPos,dirLight);
  return dirColor;
}

void main(){
  vec3 _normal=normalize(cross(dFdx(vPos),dFdy(vPos)));
  vec3 hemiColor=calcHemiColor(_normal);
  vec3 dirColor=calcDirColor(_normal);
  
  vec3 color=vec3(1.);
  color*=hemiColor;
  color+=dirColor;
  
  color+=adjustByFrequency();
  color+=adjustByPos();
  float time=uTime/10.;
  color.b+=sin(time+PI/4.*(color.b-.5))/4.+.5;
  color=min(vec3(1.),color+.1);
  
  gl_FragColor=vec4(color,.95);
}