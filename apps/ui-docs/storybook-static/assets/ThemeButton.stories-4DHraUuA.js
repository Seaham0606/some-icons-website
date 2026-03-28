import{j as d}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./iframe-DLYWTf-H.js";import{T as t}from"./index-DPhOrz7g.js";import"./preload-helper-PPVm8Dsz.js";const u={title:"ThemeButton",component:t,tags:["autodocs"],argTypes:{mode:{control:"select",options:["light","dark"]},onToggle:{action:"toggle"}}},e={args:{mode:"light",onToggle:()=>{}}},o={args:{mode:"dark",onToggle:()=>{}}},r={render:function(){const[a,s]=c.useState("light");return d.jsx(t,{mode:a,onToggle:()=>s(n=>n==="dark"?"light":"dark")})}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    mode: "light",
    onToggle: () => {}
  }
}`,...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    mode: "dark",
    onToggle: () => {}
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: function InteractiveRender() {
    const [mode, setMode] = useState<"light" | "dark">("light");
    return <ThemeButton mode={mode} onToggle={() => setMode(m => m === "dark" ? "light" : "dark")} />;
  }
}`,...r.parameters?.docs?.source}}};const h=["LightMode","DarkMode","Interactive"];export{o as DarkMode,r as Interactive,e as LightMode,h as __namedExportsOrder,u as default};
