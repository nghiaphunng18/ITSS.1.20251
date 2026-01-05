"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2, Save, Clock, Trash } from "lucide-react"; // Import thêm Trash
import { CheckpointData, SaveCheckpointRequest } from "@/types/presentation";

type CheckpointFormValues = {
  question: string;
  options: { text: string }[];
  correctAnswer: string[];
  timeLimit: number;
};

interface Props {
  pageNumber: number;
  existingCheckpoint?: CheckpointData;
  onSave: (data: Omit<SaveCheckpointRequest, "userId">) => Promise<void>;
  onDelete: () => Promise<void>; // Thêm prop này
  isSaving: boolean;
}

export default function CheckpointEditorSidebar({
  pageNumber,
  existingCheckpoint,
  onSave,
  onDelete, // Nhận prop
  isSaving,
}: Props) {
  const { register, control, handleSubmit, reset, setValue } =
    useForm<CheckpointFormValues>({
      defaultValues: {
        question: "",
        options: [{ text: "" }, { text: "" }],
        correctAnswer: [],
        timeLimit: 30,
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const currentCorrectAnswers = useWatch({
    control,
    name: "correctAnswer",
    defaultValue: [],
  });

  useEffect(() => {
    if (existingCheckpoint) {
      reset({
        question: existingCheckpoint.question,
        options: existingCheckpoint.options.map((opt) => ({ text: opt.text })),
        correctAnswer: existingCheckpoint.correctAnswer || [],
        timeLimit: existingCheckpoint.timeLimit,
      });
    } else {
      reset({
        question: "",
        options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        correctAnswer: [],
        timeLimit: 30,
      });
    }
  }, [existingCheckpoint, pageNumber, reset]);

  const onSubmit = (data: CheckpointFormValues) => {
    if (data.correctAnswer.length === 0) {
      alert("Vui lòng chọn ít nhất một đáp án đúng!");
      return;
    }

    const formattedOptions = data.options.map((opt, index) => ({
      id: String.fromCharCode(65 + index),
      text: opt.text,
    }));

    const validIDs = formattedOptions.map((o) => o.id);
    const cleanCorrectAnswers = data.correctAnswer.filter((id) =>
      validIDs.includes(id)
    );

    const payload = {
      pageNumber,
      question: data.question,
      options: formattedOptions,
      correctAnswer: cleanCorrectAnswers,
      timeLimit: Number(data.timeLimit),
    };
    onSave(payload);
  };

  const addOption = () => {
    append({ text: "" });
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const current = [...currentCorrectAnswers];
    if (checked) {
      setValue("correctAnswer", [...current, id]);
    } else {
      setValue(
        "correctAnswer",
        current.filter((item) => item !== id)
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l shadow-sm">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
            Trang {pageNumber}
          </span>
          {existingCheckpoint ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <form
          id="checkpoint-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Câu hỏi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung câu hỏi
            </label>
            <textarea
              {...register("question", { required: true })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-20"
              placeholder="Nhập câu hỏi..."
            />
          </div>

          {/* Đáp án */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Các phương án (Chọn đáp án đúng)
              </label>
              <button
                type="button"
                onClick={addOption}
                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Plus size={14} /> Thêm
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => {
                const optionLabel = String.fromCharCode(65 + index);
                const isChecked = currentCorrectAnswers.includes(optionLabel);

                return (
                  <div key={field.id} className="flex gap-2 items-start">
                    <div className="pt-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          handleCheckboxChange(optionLabel, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 cursor-pointer rounded border-gray-300 focus:ring-blue-500"
                        title={`Chọn ${optionLabel} làm đáp án đúng`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500 w-4">
                          {optionLabel}.
                        </span>
                        <input
                          {...register(`options.${index}.text` as const, {
                            required: true,
                          })}
                          className={`flex-1 border rounded p-1.5 text-sm outline-none transition-colors ${
                            isChecked
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 focus:border-blue-500"
                          }`}
                          placeholder={`Đáp án ${optionLabel}`}
                        />
                      </div>
                    </div>
                    {fields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="pt-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              * Hệ thống sẽ tự động gán nhãn A, B, C, D theo thứ tự.
            </p>
          </div>

          {/* Thời gian */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Clock size={16} /> Thời gian trả lời (giây)
            </label>
            <input
              type="number"
              {...register("timeLimit", { min: 10, max: 300 })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </form>
      </div>

      <div className="p-4 border-t bg-gray-50 flex gap-2">
        {/* Nút Xóa (Chỉ hiện khi đã có câu hỏi cũ) */}
        {existingCheckpoint && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) {
                onDelete();
              }
            }}
            className="flex items-center justify-center bg-red-100 text-red-600 px-3 py-2.5 rounded-md hover:bg-red-200 transition"
            title="Xóa câu hỏi"
          >
            <Trash size={18} />
          </button>
        )}

        {/* Nút Lưu */}
        <button
          form="checkpoint-form"
          type="submit"
          disabled={isSaving}
          className="flex-1 flex justify-center items-center gap-2 bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 font-medium transition disabled:opacity-50"
        >
          {isSaving ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save size={18} />
          )}
          {existingCheckpoint ? "Cập nhật" : "Lưu câu hỏi"}
        </button>
      </div>
    </div>
  );
}
