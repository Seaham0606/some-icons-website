import{j as n}from"./index-ytRKo10x.js";import{S as o}from"./index-CAnsHohd.js";import"./iframe-asEztNxr.js";import"./index-D1OtZOqg.js";import"./preload-helper-PPVm8Dsz.js";function d({size:e,children:l}){return n.jsx("div",{style:{width:e,height:e,color:"var(--color-main-primary)"},children:l})}const m=["2xs","xs","sm","md","lg","xl","2xl"],p=["0","050","1","2"],I={title:"SomeIcon",component:o,tags:["autodocs"],argTypes:{iconName:{control:"text",description:"Must match an `id` from the CDN `index.json`."},iconStyle:{control:"select",options:["outline","fill"]},cdnBaseUrl:{control:"text",description:"Optional override; defaults to package `someIconsCdnBaseUrl`."},color:{table:{category:"Appearance"}},className:{table:{category:"Appearance"}},iconSize:{control:"select",options:m,description:"Glyph size — theme `--size-icon-*`."},padding:{control:"select",options:p,description:"Inset from theme `--spacing-*` (excludes `025`). Outer box = `2 × padding + iconSize`."}}},r={render:e=>n.jsx(d,{size:24,children:n.jsx(o,{...e})}),args:{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"md",padding:"0"}},c={render:e=>n.jsx(d,{size:24,children:n.jsx(o,{...e})}),args:{iconName:"formatting-pencil-alt",iconStyle:"fill",iconSize:"md",padding:"0"}},s={render:e=>n.jsx(d,{size:24,children:n.jsx(o,{...e})}),args:{iconName:"arrow-up-out",iconStyle:"outline",color:"var(--color-intent-accent)",iconSize:"md",padding:"0"}},a={name:"Larger frame (40px)",render:e=>n.jsx(d,{size:40,children:n.jsx(o,{...e})}),args:{iconName:"arrow-up-out",iconStyle:"outline",iconSize:"md",padding:"2"}},i={name:"Input slot (md + padding 2)",render:e=>n.jsx("div",{style:{color:"var(--color-main-primary)"},children:n.jsx(o,{...e})}),args:{iconName:"interface-search",iconStyle:"outline",iconSize:"md",padding:"2"}},t={name:"InputSection leading (2xs)",render:e=>n.jsx("div",{style:{color:"var(--color-main-primary)"},children:n.jsx(o,{...e})}),args:{iconName:"formatting-pencil-alt",iconStyle:"outline",iconSize:"2xs",padding:"0"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>,
  args: {
    iconName: "formatting-pencil-alt",
    iconStyle: "outline",
    iconSize: "md",
    padding: "0"
  }
}`,...r.parameters?.docs?.source},description:{story:"Fetches `index.json` + SVG from the default CDN. Requires network; shows nothing until loaded.",...r.parameters?.docs?.description}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>,
  args: {
    iconName: "formatting-pencil-alt",
    iconStyle: "fill",
    iconSize: "md",
    padding: "0"
  }
}`,...c.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <IconFrame size={24}>
      <SomeIcon {...args} />
    </IconFrame>,
  args: {
    iconName: "arrow-up-out",
    iconStyle: "outline",
    color: "var(--color-intent-accent)",
    iconSize: "md",
    padding: "0"
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "Larger frame (40px)",
  render: args => <IconFrame size={40}>
      <SomeIcon {...args} />
    </IconFrame>,
  args: {
    iconName: "arrow-up-out",
    iconStyle: "outline",
    iconSize: "md",
    padding: "2"
  }
}`,...a.parameters?.docs?.source},description:{story:"40×40 frame: `icon-md` + `spacing-2` padding on each side.",...a.parameters?.docs?.description}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: "Input slot (md + padding 2)",
  render: args => <div style={{
    color: "var(--color-main-primary)"
  }}>
      <SomeIcon {...args} />
    </div>,
  args: {
    iconName: "interface-search",
    iconStyle: "outline",
    iconSize: "md",
    padding: "2"
  }
}`,...i.parameters?.docs?.source},description:{story:"Design-system `Input` leading/trailing slot: 40×40 outer, 24px glyph.",...i.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "InputSection leading (2xs)",
  render: args => <div style={{
    color: "var(--color-main-primary)"
  }}>
      <SomeIcon {...args} />
    </div>,
  args: {
    iconName: "formatting-pencil-alt",
    iconStyle: "outline",
    iconSize: "2xs",
    padding: "0"
  }
}`,...t.parameters?.docs?.source},description:{story:"`InputSection` label-row leading/trailing: 12×12 glyph (`icon-2xs`), no inset.",...t.parameters?.docs?.description}}};const f=["Default","Filled","AccentColor","LargerFrame","InputSlot","InputSectionLeading"];export{s as AccentColor,r as Default,c as Filled,t as InputSectionLeading,i as InputSlot,a as LargerFrame,f as __namedExportsOrder,I as default};
