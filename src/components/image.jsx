import Image from "next/image";

export function NextImage({ children, ...props }) {
  return (
    <Image {...props} src={props.src}>
      {children}
    </Image>
  );
}

export function MdxImage({ children, ...props }) {
  return (
    <div className="mdx_img_container">
      <Image {...props} src={props.src}>
        {children}
      </Image>
    </div>
  );
}
