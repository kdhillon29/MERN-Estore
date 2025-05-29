import React from "react";
import ImageUploading from "react-images-uploading";
import { Trash } from "lucide-react";

export default function ImageUploader({ images, setImages }) {
  const maxNumber = 5;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          //   onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              className="bg-green-400 p-2 rounded-md hover:bg-green-500"
              style={isDragging ? { color: "red" } : undefined}
              onClick={(e) => {
                e.preventDefault();
                onImageUpload(e);
              }}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button
              className=" text-red-400  hover:text-red-500"
              onClick={(e) => {
                e.preventDefault();
                onImageRemoveAll(e);
              }}
            >
              Remove all images
            </button>
            {imageList.map((image, index) => (
              <div key={index} className=" relative my-2 ">
                <img src={image["data_url"]} alt="" width="100" />
                <div className=" absolute bg-teal-100 p-2 rounded-4xl cursor-pointer top-0 left-20 flex items-center gap-2 space-x-2">
                  <Trash
                    size={15}
                    onClick={(e) => {
                      e.preventDefault();
                      onImageRemove(index);
                    }}
                    color="red"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
