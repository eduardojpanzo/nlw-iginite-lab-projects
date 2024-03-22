import { CheckCircle, Lock } from "phosphor-react";
import { isPast, format } from "date-fns";
import pt from "date-fns/locale/pt";
import { Link, useParams } from "react-router-dom";

interface LessonProps {
  title: string;
  slug: string;
  availableAt: Date;
  type: "live" | "class";
}

export function Lesson({ title, slug, availableAt, type }: LessonProps) {
  const { slug: currentSlug } = useParams<{ slug: string }>();

  const isLessonAvailable = isPast(availableAt);
  const avaliableDateFormatted = format(
    availableAt,
    "EEEE' • 'd' de 'MMMM' • 'K'h'mm",
    {
      locale: pt,
    }
  );

  const isActiveLesson = currentSlug === slug;
  return (
    <Link to={`/event/lesson/${slug}`} className="group">
      <span className="text-gray-300">{avaliableDateFormatted}</span>

      <div
        className={`rounded border border-gray-500 p-4 pt-2 group-hover:border-green-500 ${
          isActiveLesson ? "bg-green-500" : ""
        }`}
      >
        <header className="flex items-center justify-between">
          {isLessonAvailable ? (
            <span
              className={`text-sm text-blue-500 font-medium flex items-center gap-2 ${
                isActiveLesson ? "text-white" : "text-blue-500"
              }`}
            >
              <CheckCircle size={20} />
              Conteúdo Liberado
            </span>
          ) : (
            <span className="text-sm text-orange-500 font-medium flex items-center gap-2">
              <Lock size={20} />
              Em breve
            </span>
          )}
          <span
            className={`text-xs rounded py-[0.125rem] px-2 text-white border border-green-300 font-bold ${
              isActiveLesson ? "border-white" : "border-green-300"
            }`}
          >
            {type === "live" ? " AO VIVO" : "AULA PRÁTICA"}
          </span>
        </header>

        <strong
          className={`text-gray-200 mt-5 block ${
            isActiveLesson ? "text-white" : "text-gray-200"
          }`}
        >
          {title}
        </strong>
      </div>
    </Link>
  );
}
