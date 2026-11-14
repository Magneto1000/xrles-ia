import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { PdfTextProcessorService } from "@/core/services/pdf-text-processor.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const customTitle = (formData.get("title") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo PDF foi enviado." },
        { status: 400 }
      );
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { error: "Formato inválido. Envie exclusivamente arquivos .PDF." },
        { status: 400 }
      );
    }

    // Converte o arquivo para Uint8Array (padrão nativo de alta performance)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Carrega o documento PDF e extrai texto + número de páginas com unpdf
    const pdfProxy = await getDocumentProxy(uint8Array);
    const { totalPages, text } = await extractText(pdfProxy, {
      mergePages: true,
    });

    const fullText = Array.isArray(text) ? text.join("\n\n") : text;

    if (!fullText || fullText.trim().length === 0) {
      return NextResponse.json(
        {
          error:
            "Este PDF não contém texto selecionável (pode ser apenas imagem escaneada).",
        },
        { status: 422 }
      );
    }

    // Aciona a Camada de Domínio para higienizar e fatiar o texto
    const extractedDocument = PdfTextProcessorService.buildExtractedDocument(
      customTitle,
      file.name,
      totalPages || 1,
      fullText
    );

    return NextResponse.json({ data: extractedDocument }, { status: 200 });
  } catch (error: unknown) {
    console.error("[EXTRACT_PDF_ERROR]:", error);
    const details =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { error: `Falha ao processar o arquivo PDF: ${details}` },
      { status: 500 }
    );
  }
}