import{j as r}from"./jsx-runtime-u17CrQMm.js";import{d as n}from"./index-DYD40Rep.js";import"./iframe-CBfxnU_t.js";import"./preload-helper-PPVm8Dsz.js";function s({size:e,children:i}){return r.jsx("div",{style:{width:e,height:e,color:"var(--color-main-primary)"},children:i})}const u={title:"SomeIcon",component:n,tags:["autodocs"],argTypes:{iconName:{control:"text",description:"Must match an `id` from the CDN `index.json`."},iconStyle:{control:"select",options:["outline","fill"]},cdnBaseUrl:{control:"text",description:"Optional override; defaults to package `someIconsCdnBaseUrl`."},color:{table:{category:"Appearance"}},className:{table:{category:"Appearance"}}}},o={render:e=>r.jsx(s,{size:24,children:r.jsx(n,{...e})}),args:{iconName:"formatting-pencil-alt",iconStyle:"outline"}},a={render:e=>r.jsx(s,{size:24,children:r.jsx(n,{...e})}),args:{iconName:"formatting-pencil-alt",iconStyle:"fill"}},t={render:e=>r.jsx(s,{size:24,children:r.jsx(n,{...e})}),args:{iconName:"arrow-up-out",iconStyle:"outline",color:"var(--color-intent-accent)"}},c={name:"Larger frame (40px)",render:e=>r.jsx(s,{size:40,children:r.jsx(n,{...e})}),args:{iconName:"arrow-up-out",iconStyle:"outline"}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>,
  args: {
    iconName: "formatting-pencil-alt",
    iconStyle: "outline"
  }
}`,...o.parameters?.docs?.source},description:{story:"Fetches `index.json` + SVG from the default CDN. Requires network; shows nothing until loaded.",...o.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: args => <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>,
  args: {
    iconName: "formatting-pencil-alt",
    iconStyle: "fill"
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: args => <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>,
  args: {
    iconName: "arrow-up-out",
    iconStyle: "outline",
    color: "var(--color-intent-accent)"
  }
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: "Larger frame (40px)",
  render: args => <IconFrame size={40}>
      <SomeIcon {...args} />
    </IconFrame>,
  args: {
    iconName: "arrow-up-out",
    iconStyle: "outline"
  }
}`,...c.parameters?.docs?.source}}};const g=["Default","Filled","AccentColor","LargerFrame"];export{t as AccentColor,o as Default,a as Filled,c as LargerFrame,g as __namedExportsOrder,u as default};
