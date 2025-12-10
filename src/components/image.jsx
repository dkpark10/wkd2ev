import Image from "next/image";

export function NextImage({ children, ...props }) {
  const prefix = process.env.NODE_ENV === "production" ? "/wkd2ev" : "";
  return (
    <Image {...props} src={`${prefix}${props.src}`}>
      {children}
    </Image>
  );
}

export function MdxImage({ children, ...props }) {
  const prefix = process.env.NODE_ENV === "production" ? "/wkd2ev" : "";
  return (
    <div className="mdx_img_container">
      <Image {...props} src={`${prefix}${props.src}`}>
        {children}
      </Image>
    </div>
  );
}
