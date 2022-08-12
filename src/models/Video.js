/*우선 moongoes에게 우리 애플리케이션의 데이터들이 
어떻게 생겼는지 알려주어야 한다. 제목, 세부설명 등의 
데이터 형태를 알려주어야 한다. 데이터 베이스가 알아야 하는 것은
데이터가 어떻게 생겼는가 하는 것이다.
예를 들어 비디오 데이터에는 제목이 있고 이는 문자형 이라는 것을
알려주어야 한다.*/
// we usually use first capital letter for mongoose model's name.
import mongoose from "mongoose";

//데이터의 형식 정하기
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, required: true, default: Date.now }, // required:date가 반드시 포함되어야 한다.
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, dafault: 0, required: true },
    rating: { type: Number, dafault: 0, required: true },
  },
});

const movieModel = mongoose.model("video", videoSchema);
export default movieModel;

//이제는 우리가 올린 비디오를 모두가 알 수 있도록 만들어야 한다.
